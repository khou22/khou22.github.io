import { classNames } from "@/utils/style";
import Link, { LinkProps } from "next/link";
import React, { AnchorHTMLAttributes } from "react";

type CustomLinkProps = {
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
} & LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export const CustomLink: React.FC<CustomLinkProps> = ({
  children,
  underline,
  ...props
}) => {
  const className = classNames(
    "text-blue-500 hover:text-blue-600",
    underline ? "underline" : "",
    props.className,
  );

  return (
    <Link {...props} className={className}>
      {children}
    </Link>
  );
};
