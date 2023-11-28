import React from "react";

export const PhotographyDropdown: React.FC = () => {
  return (
    <div className="mx-auto grid max-w-screen-xl gap-4 px-4 py-5 text-gray-900 sm:grid-cols-2 md:px-6">
      <ul>
        <li>
          <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
            <div className="font-semibold">Online Stores</div>
            <span className="text-sm">
              Connect with third-party tools that you are already using.
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
            <div className="font-semibold">Segmentation</div>
            <span className="text-sm text-gray-500">
              Connect with third-party tools that you are already using.
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
            <div className="font-semibold">Marketing CRM</div>
            <span className="text-sm text-gray-500">
              Connect with third-party tools that you are already using.
            </span>
          </a>
        </li>
      </ul>
      <ul>
        <li>
          <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
            <div className="font-semibold">Online Stores</div>
            <span className="text-sm text-gray-500">
              Connect with third-party tools that you are already using.
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
            <div className="font-semibold">Segmentation</div>
            <span className="text-sm text-gray-500">
              Connect with third-party tools that you are already using.
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
            <div className="font-semibold">Marketing CRM</div>
            <span className="text-sm text-gray-500">
              Connect with third-party tools that you are already using.
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
};
