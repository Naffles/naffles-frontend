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
export const CloseBurger = ({ 
  colour = "black",
  size = "base",
  className
}: IconProps) => {
  return (
  <svg 
    width="800px" 
    height="800px" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`${iconStyles({size})} ${className}`}
  >
    <g id="Menu / Close_LG">
      <path id="Vector" d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  );
}
