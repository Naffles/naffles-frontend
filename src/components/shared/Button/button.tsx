"use-client";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";


interface ButtonProps {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isOutline?: boolean;
  defaultButton?: boolean;
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  spinnerColour?: boolean;
  subClassName?: string;
};

const btnStyles = cva(
  "px-4 py-2 rounded-md font-roboto-body uppercase font-bold selection:transition-opacity ease-out duration-300 cursor-pointer hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-nafl-sys-complete",
  {
    variants: {
      variant: {
        primary: "text-nafl-sponge-500 bg-nafl-charcoal-600",
        secondary: "bg-nafl-yellow-500 text-nafl-grey-900",
        tertiary: "bg-nafl-charcoal-800 text-nafl-charcoal-100",
        special:
          "bg-gradient-to-r from-nafl-jade-500 to-nafl-sponge-500 text-nafl-charcoal-800",
        outline: "border-2 border-nafl-charcoal-800 text-nafl-charcoal-800",
      },
      size: {
        sx: "!font-mono text-body-xs",
        sm: "text-body-sm",
        base: "text-body-base",
        lg: "text-body-lg",
        xl: "text-body-xl",
      },
      width: {
        span: "w-full",
        inhert: "",
      },
      state: {
        default: "",
        loading: "pointer-events-none",
        disabled:
          "opacity-60 bg-nafl-charcoal-500 text-nafl-charcoal-300 pointer-events-none",
      },
      weight: {
        bold: "font-bold",
        base: "font-normal",
        light: "font-light",
      },
    },
  }
);

interface ButtonProps extends VariantProps<typeof btnStyles> {
  type?: string;
}
const Button: React.FC<ButtonProps> = ({
  variant,
  label,
  size,
  state,
  width,
  weight,
  children,
  className,
  leftIcon,
  rightIcon,
  isOutline,
  spinnerColour,
  subClassName,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`${btnStyles({
        variant,
        width,
        state,
        weight,
        size,
      })} ${className} flex justify-center items-center`}
      {...props}
    >
      <span className="flex space-x-2 items-center flex-row justify-between">
        {leftIcon && leftIcon}
        {children}
        {rightIcon && rightIcon}
      </span>
    </button>
  );
};

export default Button;
