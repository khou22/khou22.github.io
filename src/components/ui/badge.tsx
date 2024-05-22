import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/shadcn";


const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline: "text-slate-950 dark:text-slate-50",
        red: "border-red-500/50 text-red-500 dark:border-red-500/50 dark:text-red-500 hover:bg-red-500/10",
        orange:
          "border-orange-500/50 text-orange-500 dark:border-orange-500/50 dark:text-orange-500 hover:bg-orange-500/10",
        yellow:
          "border-yellow-500/50 text-yellow-500 dark:border-yellow-500/50 dark:text-yellow-500 hover:bg-yellow-500/10",
        green:
          "border-green-500/50 text-green-500 dark:border-green-500/50 dark:text-green-500 hover:bg-green-500/10",
        blue: "border-blue-500/50 text-blue-500 dark:border-blue-500/50 dark:text-blue-500 hover:bg-blue-500/10",
        purple:
          "border-purple-500/50 text-purple-500 dark:border-purple-500/50 dark:text-purple-500 hover:bg-purple-500/10",
        pink: "border-pink-500/50 text-pink-500 dark:border-pink-500/50 dark:text-pink-500 hover:bg-pink-500/10",
        gray: "border-slate-600 text-slate-900 dark:border-slate-200 dark:text-slate-50 hover:bg-slate-600/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
