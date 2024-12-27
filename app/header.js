import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Example() {
  return (
    <Disclosure
      as="nav"
      className="bg-white shadow"
    >
      <div className="mx-auto px-2 px-8">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <a
              href="/admin"
              className="flex flex-shrink-0 items-center"
            >
              <img
                alt="Your Company"
                src="/FJBC_Logo.png"
                className="h-8 w-auto"
              />
            </a>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/sell/list"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                銷售列表
              </a>
              <a
                href="/sell/count"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                銷售數量
              </a>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
