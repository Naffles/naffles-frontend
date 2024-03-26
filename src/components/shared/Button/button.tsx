// create reusable button component that can be used in multiple places
// props: label, leftIcon, rightIcon, isOutline, default
type ButtonProps = {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isOutline?: boolean;
  defaultButton?: boolean;
};

const Button: React.FC<ButtonProps> = ({ 
  label,
  leftIcon, rightIcon, isOutline, defaultButton }) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-transparent transition-colors ${
        isOutline
        ? "bg-transparent text-white hover:bg-white hover:text-black"
        : "bg-white text-black hover:bg-black hover:text-white"
      } `}
      >
      {leftIcon}
      {label}
      {rightIcon}
    </button>
  );
};

export default Button;
