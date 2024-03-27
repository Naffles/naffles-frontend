"use-client";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";


interface ButtonProps {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isOutline?: boolean;
  defaultButton?: boolean;
  children?: JSX.Element | JSX.Element[];
  className?: string;
  spinnerColour?: boolean;
  subClassName?: string;
};

const btnStyles = cva(
  "px-4 py-2 rounded-md font-roboto-body uppercase font-bold selection:transition-opacity ease-out duration-300 cursor-pointer hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-nafl-sys-complete",
  {
    variants: {
      variant: {
        primary: "bg-nafl-sponge-500 text-nafl-charcoal-800",
        secondary: "bg-nafl-jade-500 text-nafl-charcoal-100",
        tertiary: "bg-nafl-charcoal-800 text-nafl-charcoal-100",
        special:
          "bg-gradient-to-r from-nafl-jade-500 to-nafl-sponge-500 text-nafl-charcoal-800",
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
        disabled: "opacity-60 bg-nafl-charcoal-500 text-nafl-charcoal-300 pointer-events-none",
      },
      weight: {
        bold: "font-bold",
        base: "font-normal",
        light: "font-light",
      },
    },
  }
);

interface ButtonProps extends VariantProps<typeof btnStyles>{}
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
  const isSpinnerActive = false;

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
      <span className="flex space-x-2 items-center">
        {children}
        {isSpinnerActive ? (
          <span className="flex space-x-2 items-center animate-pulse justify-center">
            {spinnerColour ? (
              <Image
                src="/static/Dual Ring-1s-200px.gif"
                width={24}
                height={24}
                alt="Spinner Black"
              />
            ) : (
              <Image
                src="/static/Dual Ring-white-1s-200px.gif"
                width={24}
                height={24}
                alt="Spinner White"
              />
            )}
            <span className={`${subClassName}`}>{label}...</span>
          </span>
        ) : (
          <span className={`w-full ${subClassName}`}>{label}</span>
        )}
      </span>
    </button>
  );
};

export default Button;
