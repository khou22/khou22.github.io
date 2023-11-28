import { classNames } from "@/utils/style";

type PageWrapperProps = {
  className?: string;
  disableMaxWidth?: boolean;

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
  disableMaxWidth = false,
  children,
}) => {
  return (
    <div
      className={classNames(
        "m-auto flex w-full  flex-col items-start justify-start px-3 py-3 md:px-8 md:py-6",
        disableMaxWidth ? "" : "max-w-3xl xl:max-w-4xl 2xl:max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
};
