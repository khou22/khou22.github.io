"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon/CheckCircleIcon";
import { CrossCircledIcon } from "@radix-ui/react-icons";

type ActionButtonProps = {
  onClick: () => Promise<void> | void;
  successLabel?: string | React.ReactNode;
  errorLabel?: string | React.ReactNode;
  noticeDuration?: number;
} & Omit<ButtonProps, "onClick">;

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant: specifiedVariant,
  onClick,
  successLabel = <CheckCircleIcon className="h-6 w-6" />,
  errorLabel = <CrossCircledIcon className="h-6 w-6" />,
  noticeDuration = 3000,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsCompleted(false);
      await onClick();
      setIsCompleted(true);
      timeoutRef.current = setTimeout(() => {
        setIsCompleted(false);
      }, noticeDuration);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        timeoutRef.current = setTimeout(() => {
          setError(null);
        }, noticeDuration);
      } else {
        console.error("Unable to handle error", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onClick, noticeDuration]);

  // Clear the timeout when the component unmounts.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const variant: ButtonProps["variant"] = isCompleted
    ? "success"
    : error
      ? "destructive"
      : specifiedVariant;

  return (
    <Button
      {...props}
      variant={variant}
      onClick={handleClick}
      className="relative"
      loading={isLoading}
    >
      <span className={isCompleted || error ? "opacity-0" : "opacity-100"}>
        {props.children}
      </span>
      {isCompleted || error ? (
        <span className="absolute left-0 top-0 z-10 flex h-full w-full flex-row items-center justify-center">
          {isCompleted ? successLabel : errorLabel}
        </span>
      ) : null}
    </Button>
  );
};
