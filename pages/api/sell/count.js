import pool from "../../../lib/msdb";

export default async function handler(req, res) {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const orderType = req.query.orderType;
  const supplier = req.query.supplier;
  let sql = `
    WITH order_list AS (
      SELECT 
          OrderDate,
          OrderNumber,
          P.BarCode,
          OD.Price,
          OD.Amount,
          OD.DiscountPrice,
          OD.TotalPrice
      FROM OrderDetail AS OD
      LEFT JOIN Products AS P ON OD.ProductID = P.ProductID
      LEFT JOIN Orders AS O ON OD.OrderID = O.OrderID
      WHERE OD.PayStatus= 'Y' AND OD.OrderID IS NOT NULL AND P.BarCode != ''
    )

    SELECT 
      p.BarCode,
      pt.ProductTypeName,
      p.ProductName,
      ol.Price,
      SUM(Amount) Amount,
      SUM(DiscountPrice) DiscountPrice,
      SUM(TotalPrice) TotalPrice
    FROM Products p
    INNER JOIN order_list ol ON p.BarCode = ol.BarCode
    INNER JOIN ProductType pt ON p.ProductTypeID = pt.ProductTypeID
    WHERE OrderDate BETWEEN '${startDate} 00:00:00' AND '${endDate} 23:59:59'`;

  if (orderType == 1) {
    sql += ` AND OrderNumber LIKE '%SA%'`;
  } else if (orderType == 2) {
    sql += ` AND OrderNumber LIKE '%CA%'`;
  }

  if (supplier == 1) {
    sql += ` AND p.BarCode LIKE '%A%'`;
  } else if (supplier == 2) {
    sql += ` AND p.BarCode LIKE '%B%'`;
  } else if (supplier == 3) {
    sql += ` AND p.BarCode LIKE '%C%'`;
  }

  sql += `
    GROUP BY p.ProductName, pt.ProductTypeName, ol.Price, p.BarCode
    ORDER BY p.BarCode
    `;
  try {
    const result = await pool.request().query(sql);
    const data = result.recordset; // 取得資料

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "資料撈取失敗" });
  } finally {
    // pool.close();
  }
}
