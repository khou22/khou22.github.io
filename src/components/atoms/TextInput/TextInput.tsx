import React from "react";
import { classNames } from "@/utils/style";
import { IconProps } from "@/components/icons/types";

type IconBaseProps = Pick<IconProps, "className">;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.JSXElementConstructor<IconBaseProps>;
  endIcon?: React.JSXElementConstructor<IconBaseProps>;
}

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon: startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="relative w-full">
        {StartIcon && (
          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 transform">
            <StartIcon className="h-6 w-6 text-gray-900" />
          </div>
        )}
        <input
          type={type}
          className={classNames(
            "relative block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            startIcon ? "pl-8" : "",
            endIcon ? "pr-8" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <EndIcon className="h-6 w-6 text-gray-900" />
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
