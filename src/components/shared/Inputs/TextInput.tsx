import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

type TextInputProps = {
  name: string;
  label: string | ReactNode;
  placeholder?: string;
  type?: string;
  notes?: string | ReactNode;
  errorMessage?: string;
  minLength?: number;
  required?: boolean;
  onBlur?: (args: any) => any;
};

export const TextInput = ({
  label,
  name,
  placeholder,
  notes,
  errorMessage,
  minLength,
  required = false,
  onBlur,
  ...props
}: TextInputProps) => {
  const { register, formState } = useFormContext() || {};
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(event.target.value); // Call the provided onBlur with the email value
    }
  };
  const inputErrors = formState?.errors?.[name]?.message;
  return (
    <div className="flex flex-col items-start space-y-2 w-full">
      {/* <label className="text-body-xs text-nafl-sponge-500">{label}</label> */}
      <input
        className="w-full h-[50px] bg-[#4B4B4B] text-body-base text-nafl-charcoal-100 border-[1px] rounded-lg p-2 border-nafl-sponge-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-nafl-sys-complete placeholder:text-nafl-charcoal-400 placeholder:text-body-base font-face-roboto font-bold"
        type="text"
        placeholder={placeholder}
        key={name}
        {...props}
        {...register?.(name, {
          ...(minLength && {
            minLength: {
              value: minLength,
              message: "Minimum length is " + minLength,
            },
          }),
          ...(required && {
            required: {
              value: required,
              message: label + " is required",
            },
          }),
          onBlur: handleBlur
        })}
      />
      {inputErrors && (
        <label className="text-body-xs text-nafl-sys-error px-1">
          {inputErrors as string}
        </label>
      )}
      {errorMessage && (
        <label className="text-body-xs text-nafl-sys-error px-1">
          {errorMessage}
        </label>
      )}
      {notes && (
        <label className="text-body-xs text-nafl-charcoal-100 px-1">
          {notes}
        </label>
      )}
    </div>
  );
};
