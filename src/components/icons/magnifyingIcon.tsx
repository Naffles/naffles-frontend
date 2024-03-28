import colorVariants from "@components/utils/constants";
import { cva } from "class-variance-authority";

interface IconProps {
    colour: string;
    size?: "sm" | "base" | "lg" | "xl";
  }

const iconStyles = cva("bg-cover mx-0 h-full w-full", {
    variants: {
      size: {
        sm: "max-h-[2.1rem] max-w-[1.1rem]",
        base: "max-h-[3.619rem] max-w-[2.9rem]",
        lg: "max-h-[6.695rem] max-w-[5.375rem]",
        xl: "max-h-[4.5rem] max-w-[8.127rem]",
      },
    },
});

const MagnifyingIcon = ({ 
  size = "base",
  colour = "black",
}: IconProps) => {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={colorVariants[colour]}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`feather feather-search ${iconStyles({ size })} pr-1`}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    );
}
export default MagnifyingIcon;
