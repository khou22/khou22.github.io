import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";
import { classNames } from "@/utils/style";

type LinkWithArrowProps = {
  href: string;
  children?: React.ReactNode | string;
  className?: string;
};

export const LinkWithArrow: React.FC<LinkWithArrowProps> = ({
  children,
  href,
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        "group flex flex-row items-center justify-between",
        className,
      )}
    >
      {typeof children === "string" ? (
        <span className="group-hover:text-blue-500">{children}</span>
      ) : (
        children
      )}
      <ArrowRightIcon className="h-4 w-4" />
    </Link>
  );
};
