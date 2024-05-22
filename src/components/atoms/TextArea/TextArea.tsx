import React from "react";

import { classNames } from "@/utils/style";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

/**
 * Custom textarea component with styling.
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={classNames(
          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          props.className,
        )}
      />
    );
  },
);

TextArea.displayName = "TextArea";
