import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";
import Link from "next/link";

type LinkWithArrowProps = {
  href: string;
  children?: React.ReactNode | string;
};

export const LinkWithArrow: React.FC<LinkWithArrowProps> = ({
  children,
  href,
}) => {
  return (
    <Link
      href={href}
      className="group flex flex-row items-center justify-between"
    >
      {typeof children === "string" ? (
        <p className="group-hover:text-blue-500">{children}</p>
      ) : (
        children
      )}
      <ArrowRightIcon className="h-4 w-4" />
    </Link>
  );
};
