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

const PenEditIcon = ({
  colour = "black",
  size = "base",
  className,
}: IconProps) => {
    return (
    <svg className={`${iconStyles({ size })} ${className}`} width="20" height="20" viewBox="0 0 20 20" fill={colorVariants[colour]} xmlns="http://www.w3.org/2000/svg">
      <path d="M0.425781 15.1445V19.0595H4.34073L15.8872 7.513L11.9723 3.59806L0.425781 15.1445ZM18.9148 4.48545C19.3219 4.07829 19.3219 3.42058 18.9148 3.01343L16.4718 0.570502C16.0647 0.163348 15.407 0.163348 14.9998 0.570502L13.0893 2.481L17.0043 6.39594L18.9148 4.48545Z" fill="black"/>
    </svg>
  )
};
export default PenEditIcon;