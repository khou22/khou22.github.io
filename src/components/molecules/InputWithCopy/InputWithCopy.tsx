"use client";

import React from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { Input } from "@/components/ui/input";
import { copyToClipboard } from "@/utils/clipboard";
import { classNames } from "@/utils/style";

type InputWithCopyProps = {
  text: string;
  className?: string;
};

export const InputWithCopy: React.FC<InputWithCopyProps> = ({
  text,
  className = "",
}) => {
  return (
    <div className={classNames("flex items-center space-x-2", className)}>
      <Input readOnly value={text} />
      <ActionButton onClick={() => copyToClipboard({ text })}>
        Copy
      </ActionButton>
    </div>
  );
};
