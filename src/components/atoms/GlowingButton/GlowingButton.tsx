import { classNames } from "@/utils/style";

type GlowingButtonProps = {
  containerClassName?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GlowingButton: React.FC<GlowingButtonProps> = ({
  containerClassName = "",
  className,
  ...props
}) => {
  return (
    <div
      className={classNames("group relative inline-flex", containerClassName)}
    >
      <div
        className={classNames(
          "absolute -inset-px rounded-xl opacity-60 blur-lg transition-all duration-500 group-hover:-inset-1 group-hover:opacity-100 group-hover:duration-200",
          "bg-gradient-to-r from-[#44beff92] via-[#FF44EC86] to-[#FF675E86]",
        )}
      />
      <button
        title="Get quote now"
        className={classNames(
          "relative inline-flex items-center justify-center rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
          "border-white/80 bg-white/70 group-hover:bg-white/60",
          className,
        )}
        {...props}
      />
    </div>
  );
};
