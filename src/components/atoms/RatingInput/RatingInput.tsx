import React from "react";

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
}) => {
  const handleStarClick = (starValue: number) => {
    if (starValue === value) {
      onChange(0);
      return;
    }

    onChange(starValue);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`mr-1 h-6 w-6 ${
            star <= value
              ? "text-yellow-500 hover:text-yellow-400"
              : "text-gray-400 hover:text-gray-500"
          }`}
          onClick={() => handleStarClick(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};
