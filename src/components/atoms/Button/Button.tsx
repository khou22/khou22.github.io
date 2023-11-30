import { classNames } from "@/utils/style";
import React from "react";

export type ButtonProps = {
  kind?: "default" | "outline";
  color?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Renders a custom styled button component.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  kind = "default",
  color = "primary",
  className = "",
  ...props
}) => {
  let kindClassName = "";

  // Handle default filled in style.
  switch (color) {
    case "secondary":
      kindClassName = "bg-gray-500 hover:bg-gray-600 text-white";
      break;
    case "primary":
    default:
      kindClassName = "bg-blue-500 hover:bg-blue-600 text-white";
      break;
  }

  // Handle outlined style.
  if (kind === "outline") {
    switch (color) {
      case "secondary":
        kindClassName =
          "border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white";
        break;
      case "primary":
      default:
        kindClassName =
          "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white";
        break;
    }
  }

  return (
    <button
      className={classNames(
        "rounded px-4 py-2 font-bold transition-colors duration-200 ease-in-out",
        className,
        kindClassName,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
