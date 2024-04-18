import { cva } from "class-variance-authority";

interface IconProps {
  colour: string;
  size?: "sm" | "base" | "lg" | "xl";
  className?: string;
}

const iconStyles = cva("bg-cover mx-0 h-full w-full", {
  variants: {
    size: {
      sm: "max-h-[2.689rem] max-w-[1.5rem]",
      base: "max-h-[3.619rem] max-w-[2rem]",
      lg: "max-h-[6.095rem] max-w-[3.375rem]",
      xl: "max-h-[4.5rem] max-w-[8.127rem]",
    },
  },
});
export const BurgerIcon = ({ 
  colour = "black",
  size = "base",
  className
}: IconProps) => {

  return (
    <svg 
      width="800px" 
      height="800px" 
      viewBox="0 0 24 24" fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconStyles({size})} ${className}`}
    >
      <g clipPath="url(#clip0_429_11066)">
        <path d="M3 6.00092H21M3 12.0009H21M3 18.0009H21" stroke="#292929" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_429_11066">
        <rect width="24" height="24" fill="white" transform="translate(0 0.000915527)"/>
      </clipPath>
      </defs>
    </svg>
  );
};