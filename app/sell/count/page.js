"use client";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const today = new Date().toISOString().split("T")[0];

export default function Home() {
  const [items, setItems] = useState([]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [orderType, setOrderType] = useState(0);
  const [supplier, setSupplier] = useState(0);
  const [amount, setAmount] = useState(0);
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          const OrderNumber = item.OrderNumber.toLowerCase() || "";
          const return_OrderNumber = item.return_OrderNumber?.toLowerCase() || "";
          return OrderNumber.includes(query.toLowerCase()) || return_OrderNumber.includes(query.toLowerCase());
        });

  function getTableData() {
    const table = document.getElementById("myTable");
    const rows = table.querySelectorAll("tbody tr");

    // 提取表格中的資料，只選擇 Name 和 Age 欄位
    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      data.push({
        條碼: cells[0].innerText,
        商品類別: cells[1].innerText,
        商品名稱: cells[2].innerText,
        商品單價: cells[3].innerText,
        總銷售數: cells[4].innerText,
        總折扣金額: cells[5].innerText,
        實收金額: cells[6].innerText
      });
    });

    return data;
  }

  function ExportToExcel() {
    const date = new Date();
    const exportTableToExcel = () => {
      // 呼叫函數來取得選定的欄位資料
      const selectedData = getTableData();

      // 將選擇的資料轉為 worksheet
      const worksheet = XLSX.utils.json_to_sheet(selectedData);

      // 創建新的 workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // 將 workbook 寫入 Excel 檔案
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_盤點表.xlsx`);
    };

    return (
      <button
        className="m-1 relative inline-flex rounded-md items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-4 ring-inset ring-green-300 hover:bg-pink-100 focus:z-10"
        onClick={exportTableToExcel}
      >
        下載 Excel
      </button>
    );
  }

  async function getPosData() {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    let api = `/api/sell/count?startDate=${startDate}&endDate=${endDate}&orderType=${orderType}&supplier=${supplier}`;

    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setItems(res);
    } else {
      console.log(res.msg);
    }
  }

  useEffect(() => {
    getPosData();
  }, [startDate, endDate, orderType, supplier]);

  return (
    <div className="container mx-auto">
      <div className="flex items-end justify-between py-4">
        <div className="text-xl font-semibold text-gray-900">銷售數量表</div>
        <div className="flex items-end">
          <span className="isolate inline-flex rounded-md shadow-sm mx-1">
            <button
              onClick={() => {
                setOrderType(0);
              }}
              type="button"
              className={`${
                orderType == 0 ? "bg-pink-300" : "bg-white"
              } relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-pink-100 focus:z-10`}
            >
              不限
            </button>
            <button
              onClick={() => {
                setOrderType(1);
              }}
              type="button"
              className={`${
                orderType == 1 ? "bg-pink-300" : "bg-white"
              } relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-pink-100 focus:z-10`}
            >
              銷貨
            </button>
            <button
              onClick={() => {
                setOrderType(2);
              }}
              type="button"
              className={`${
                orderType == 2 ? "bg-pink-300" : "bg-white"
              } relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-pink-100 focus:z-10`}
            >
              退貨
            </button>
          </span>
          <span className="isolate inline-flex rounded-md shadow-sm mx-1">
            <button
              onClick={() => {
                setSupplier(0);
              }}
              type="button"
              className={`${
                supplier == 0 ? "bg-pink-300" : "bg-white"
              } relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-pink-100 focus:z-10`}
            >
              不限
            </button>
            <button
              onClick={() => {
                setSupplier(1);
              }}
              type="button"
              className={`${
                supplier == 1 ? "bg-pink-300" : "bg-white"
              } relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-pink-100 focus:z-10`}
            >
              蔓麵包
            </button>
            <button
              onClick={() => {
                setSupplier(2);
              }}
              type="button"
              className={`${
                supplier == 2 ? "bg-pink-300" : "bg-white"
              } relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-pink-100 focus:z-10`}
            >
              永豐麵包
            </button>
            <button
              onClick={() => {
                setSupplier(3);
              }}
              type="button"
              className={`${
                supplier == 3 ? "bg-pink-300" : "bg-white"
              } relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-pink-100 focus:z-10`}
            >
              敏 a 點心
            </button>
          </span>
          <input
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            value={startDate}
            type="date"
            className="ring-1 ring-gray-400 rounded-sm px-2 py-1"
          />
          <input
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            value={endDate}
            type="date"
            className="ring-1 ring-gray-400 rounded-sm px-2 py-1"
          />
        </div>
        <ExportToExcel />
      </div>
      <div>
        <table
          id="myTable"
          className="min-w-full divide-y divide-gray-300"
        >
          <thead className="bg-green-100 sticky top-0">
            <tr>
              <th
                scope="col"
                className="px-2 py-3 text-sm font-semibold text-gray-900 text-left"
              >
                條碼
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-sm font-semibold text-gray-900 text-left"
              >
                商品類別
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-sm font-semibold text-gray-900 text-left"
              >
                商品名稱
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-sm font-semibold text-gray-900 text-left"
              >
                商品單價
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-sm font-semibold text-gray-900 text-left"
              >
                總銷售數
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-sm font-semibold text-gray-900 text-left"
              >
                總折扣金額
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-sm font-semibold text-gray-900 text-left"
              >
                實收金額
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredItems.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={`hover:bg-blue-50`}
                >
                  <td className="whitespace-nowrap px-2 py-3 text-md text-gray-500">{item.BarCode}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-md text-gray-500">{item.ProductTypeName}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-md text-gray-500">{item.ProductName}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-md text-gray-500">{item.Price}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-md text-gray-500">{item.Amount}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-md text-gray-500">{item.DiscountPrice}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-md text-gray-500">{item.TotalPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
