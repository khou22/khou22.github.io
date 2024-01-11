"use client";

import React, { ButtonHTMLAttributes } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "@/components/icons/XIcon/XIcon";

type ModalPrimitiveProps = {
  isOpen: boolean;
  onClose: () => void;
  closeButton?: boolean;
  closeButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  children: React.ReactNode;
};

/**
 * `<ModalPrimitive />` differs from `<Dialog />` in that it is a primitive component. There is no
 * styling, just a dialog primitive to overlay content on top of the page with a close button.
 */
export const ModalPrimitive: React.FC<ModalPrimitiveProps> = ({
  isOpen,
  onClose,
  closeButton = true,
  closeButtonProps,
  children,
}) => (
  <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="data-[state=open]:animate-overlay-show fixed inset-0 z-40 bg-black/50">
        {closeButton && (
          <Dialog.Close asChild>
            <button
              className="absolute right-3 top-3 text-white"
              aria-label="Close"
              title="Close"
              {...closeButtonProps}
            >
              <XIcon className="h-6 w-6" />
            </button>
          </Dialog.Close>
        )}
      </Dialog.Overlay>
      <Dialog.Content className="data-[state=open]:animate-content-show fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]">
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
