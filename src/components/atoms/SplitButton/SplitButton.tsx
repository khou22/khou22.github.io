import * as React from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CarrotDownIcon } from "@/components/icons/CarrotDownIcon/CarrotDownIcon";
import { classNames } from "@/utils/style";

export interface SplitButtonProps extends Omit<ButtonProps, "children"> {
  // Primary action
  primaryLabel: React.ReactNode;

  // Content to render inside the dropdown
  dropdownContent: React.ReactNode;

  // Optional props specifically for the dropdown trigger button
  dropdownButtonProps?: Omit<
    ButtonProps,
    "children" | "onClick" | "size" | "variant" | "disabled"
  >;

  // Optional classes for the wrapper
  className?: string;
}

export const SplitButton: React.FC<SplitButtonProps> = ({
  primaryLabel,
  onClick,
  dropdownContent,
  dropdownButtonProps = {},
  className = "",
  ...buttonProps
}) => {
  const dropdownIconSizeClass = useMemo(() => {
    switch (buttonProps.size) {
      case "sm":
        return "h-3 w-3";
      case "default":
        return "h-4 w-4";
      case "lg":
        return "h-5 w-5";
      default:
        return "h-4 w-4";
    }
  }, [buttonProps.size]);

  return (
    <Popover>
      <div className={classNames("inline-flex", className)}>
        <Button
          onClick={onClick}
          {...buttonProps}
          className={classNames(className, "rounded-r-none")}
        >
          {primaryLabel}
        </Button>

        <PopoverTrigger asChild>
          <Button
            {...dropdownButtonProps}
            size={buttonProps.size}
            variant={buttonProps.variant}
            disabled={buttonProps.disabled}
            className={classNames(
              dropdownButtonProps.className,
              "-ml-px rounded-l-none",
            )}
          >
            <CarrotDownIcon className={dropdownIconSizeClass} />
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent align="start">{dropdownContent}</PopoverContent>
    </Popover>
  );
};
