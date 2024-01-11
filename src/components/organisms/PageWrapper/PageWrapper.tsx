import { classNames } from "@/utils/style";

type PageWrapperProps = {
  className?: string;

  /**
   * The max width of the page. Defaults to `normal`.
   */
  maxWidth?: "none" | "normal" | "wide";

  /**
   * The content of the page.
   */
  children: React.ReactNode;
};

/**
 * Standard page wrapper that sets the max width of the page contents. This should only be used
 * on non-fullscreen pages.
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({
  className = "",
  maxWidth = "normal",
  children,
}) => {
  let widthClassName = "max-w-3xl xl:max-w-4xl 2xl:max-w-6xl";
  switch (maxWidth) {
    case "wide":
      widthClassName = "max-w-6xl xl:max-w-7xl";
      break;
    case "none":
      widthClassName = "max-w-full";
      break;
  }

  return (
    <div
      className={classNames(
        "m-auto flex w-full flex-col items-start justify-start px-3 py-3 md:px-8 md:py-6",
        widthClassName,
        className,
      )}
    >
      {children}
    </div>
  );
};
