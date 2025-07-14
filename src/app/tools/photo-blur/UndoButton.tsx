"use client";

import { classNames } from "@/utils/style";
import { SplitButton } from "@/components/atoms/SplitButton/SplitButton";

interface UndoButtonProps {
  history: string[];
  onUndo: () => void;
  onJumpToState: (index: number) => void;
  disabled?: boolean;
}

export const UndoButton = ({
  history,
  onUndo,
  onJumpToState,
  disabled = false,
}: UndoButtonProps) => {
  const dropdownContent =
    history.length > 1 ? (
      <div className="max-h-80 w-64 overflow-y-auto">
        <div className="mb-2 text-xs font-medium text-gray-600">
          History ({history.length} states)
        </div>
        <div className="space-y-2">
          {history
            .slice()
            .reverse()
            .map((dataUrl, reverseIndex) => {
              const actualIndex = history.length - 1 - reverseIndex;
              const isCurrentState = actualIndex === history.length - 1;
              return (
                <button
                  key={actualIndex}
                  onClick={() => onJumpToState(actualIndex)}
                  className={classNames(
                    "flex w-full items-center gap-2 rounded text-left transition-colors hover:bg-gray-50",
                    isCurrentState && "border border-blue-200 bg-blue-50",
                  )}
                >
                  <img
                    src={dataUrl}
                    alt={`State ${actualIndex + 1}`}
                    className="h-12 w-12 flex-shrink-0 rounded border border-gray-200 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {isCurrentState ? "Current" : `State ${actualIndex + 1}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {reverseIndex === 0
                        ? "Latest"
                        : `${reverseIndex} step${
                            reverseIndex === 1 ? "" : "s"
                          } ago`}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    ) : null;

  return (
    <SplitButton
      primaryLabel="Undo"
      onClick={onUndo}
      variant="outline"
      disabled={disabled || history.length === 0}
      dropdownContent={dropdownContent}
      size="sm"
    />
  );
};
