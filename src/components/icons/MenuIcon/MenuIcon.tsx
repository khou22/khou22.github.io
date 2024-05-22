import React from "react";

import { IconProps } from "../types";

export const MenuIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 17 14"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 1h15M1 7h15M1 13h15"
      />
    </svg>
  );
};
