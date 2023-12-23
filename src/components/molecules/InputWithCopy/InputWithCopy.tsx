"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copyToClipboard } from "@/utils/clipboard";
import { classNames } from "@/utils/style";
import React from "react";

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
      <Button onClick={() => copyToClipboard({ text })}>Copy</Button>
    </div>
  );
};
