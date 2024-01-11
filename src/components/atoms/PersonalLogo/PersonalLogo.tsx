import React from "react";

type PersonalLogoProps = {
  blackAndWhite?: boolean;
} & React.SVGProps<SVGSVGElement>;

export const PersonalLogo: React.FC<PersonalLogoProps> = ({
  blackAndWhite = false,
  ...props
}) => {
  return (
    <svg
      aria-label="Personal Logo"
      viewBox="0 0 1260 1260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1_16)">
        <path
          d="M1135 0H125C55.9644 0 0 55.9644 0 125V1135C0 1204.04 55.9644 1260 125 1260H1135C1204.04 1260 1260 1204.04 1260 1135V125C1260 55.9644 1204.04 0 1135 0Z"
          fill="white"
        />
        <path
          d="M1133.5 1.5H126.5C57.4644 1.5 1.5 57.4644 1.5 126.5V1133.5C1.5 1202.54 57.4644 1258.5 126.5 1258.5H1133.5C1202.54 1258.5 1258.5 1202.54 1258.5 1133.5V126.5C1258.5 57.4644 1202.54 1.5 1133.5 1.5Z"
          stroke="#3286A8"
          strokeWidth="3"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M640 0V120H500V837L242 540H57L315 840L57 1140H242L500 839V1140H640V1260H125.003C55.9656 1260 0 1204.03 0 1135V125.003C0 55.9659 55.9604 0 125.003 0H640Z"
          fill="#3286A8"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M499.351 1140H640L640 120L499.35 120L499.351 836L242.112 540H57.0161L314.601 839.991L57 1140H242.096L499.351 839.991V1140Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M780 506.724C782.54 505.57 785.106 504.446 787.696 503.353C827.095 486.725 872.146 477.292 920 477.292C1067.23 477.292 1187.92 566.58 1199.15 680L1200 1140H1060V720.292C1056.95 653.575 995.444 600.292 920 600.292C844.556 600.292 783.049 653.575 780.11 720.292L780 887.741V1140H640V120H780V506.724Z"
          fill="#D5491F"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_16">
          <rect width="1260" height="1260" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
