import { classNames } from "@/utils/style";

type FormLabelProps = {
  children: React.ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  htmlFor,
  className,
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames(
        "block text-sm font-medium leading-6 text-gray-900",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
};
