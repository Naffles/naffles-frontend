import colorVariants from "@components/utils/constants";

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: string;
};
const Typography = ({
  children,
  className,
  color = 'yellow',
  size,
}: TypographyProps) =>  {

  return (
    <div className={`${className} ${size}`} style={{color: colorVariants[color], fontFamily: 'Bebas Neue, sans-serif'}}>
      {children}
    </div>
  )
};

export default Typography;