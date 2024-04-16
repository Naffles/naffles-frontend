import colorVariants from "@components/utils/constants";
import { cva } from "class-variance-authority";

interface IconProps {
  colour: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  className?: string;
}

const iconStyles = cva("bg-cover mx-0 h-full w-full", {
  variants: {
    size: {
      xs: "max-h-[1.4rem] max-w-[.9rem]",
      sm: "max-h-[2.689rem] max-w-[1.5rem]",
      base: "max-h-[3.619rem] max-w-[2rem]",
      lg: "max-h-[6.095rem] max-w-[3.375rem]",
      xl: "max-h-[4.5rem] max-w-[8.127rem]",
    },
  },
});

const ArrowRightIcon = ({
  colour = "black",
  size = "base",
  className,
  }: IconProps) => (
    <svg 
      width="26"
      height="26"
      viewBox="0 0 26 26" 
      fill={"#464646"}
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconStyles({size})} feather feather-arrow-right ${className}`}
    >
      <path d="M0.655292 14.3873L19.7132 14.3873L10.9594 23.1411L13.1831 25.3491L25.7109 12.8213L13.1831 0.293477L10.9751 2.50151L19.7132 11.2553L0.655291 11.2553L0.655292 14.3873Z" fill="#FEFF3D"/>
    </svg>
);
export default ArrowRightIcon;
