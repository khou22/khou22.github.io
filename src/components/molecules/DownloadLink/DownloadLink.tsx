import { classNames } from "@/utils/style";
import { DownloadIcon } from "@/components/icons/DownloadIcon/DownloadIcon";

type DownloadLinkProps = {
  url: string;
  fileName: string;
  icon?: "left" | "right" | "none";
  children: React.ReactNode;
};

/**
 * Generates a downloadable link with an optional icon.
 *
 * @param {DownloadLinkProps} props - Props for the DownloadLink component
 * @return {ReactNode} The DownloadLink component
 */
export const DownloadLink: React.FC<DownloadLinkProps> = ({
  icon = "right",
  ...props
}) => {
  return (
    <a
      href={props.url}
      download={props.fileName}
      className={classNames(
        "flex items-center text-blue-500 hover:text-blue-600 hover:underline",
        icon === "left" && "flex-row-reverse",
        icon === "right" && "flex-row",
        icon !== "none" && "space-x-2",
      )}
    >
      {typeof props.children === "string" ? (
        <span>{props.children}</span>
      ) : (
        props.children
      )}
      {icon !== "none" && <DownloadIcon className="h-4 w-4" />}
    </a>
  );
};
