import { classNames } from "@/utils/style";

type GlowingButtonProps = {} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GlowingButton: React.FC<GlowingButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <div className="group relative inline-flex">
      <div className="animate-tilt absolute -inset-px rounded-xl bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] opacity-70 blur-lg transition-all duration-1000 group-hover:-inset-1 group-hover:opacity-100 group-hover:duration-200"></div>
      <button
        title="Get quote now"
        className={classNames(
          "relative inline-flex items-center justify-center rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
          className,
        )}
        {...props}
      />
    </div>
  );
};
