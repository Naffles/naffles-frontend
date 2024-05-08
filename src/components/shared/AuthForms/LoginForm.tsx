import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
export type LoginSubmitData = { emailAddress: string; password: string };
type LoginProps = {
  handleLogin?: (data: any) => any;
  handleForgotClick?: () => any;
};

export const LoginForm = (props: LoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogin, handleForgotClick } = props;
  const { login } = useBasicUser();
  const onSubmit = async (data: LoginSubmitData) => {
    setIsLoading(true);
    const response = await login({
      identifier: data.emailAddress,
      password: data.password,
    });
    handleLogin?.(response);
    setIsLoading(false);
  };
  return (
    <FormContext onSubmit={onSubmit} className="flex flex-col gap-4 min-w-64">
      <TextInput
        name="emailAddress"
        label="Email Address"
        placeholder="Email Address"
      />
      <TextInput
        name="password"
        label="Password"
        placeholder="Password*"
        type="password"
        notes={
          <u className="cursor-pointer" onClick={handleForgotClick}>
            Forgot Password?
          </u>
        }
      />

      <button
        type="submit"
        className="flex items-center justify-center text-[#000] h-[45px] w-full rounded-[10px] bg-nafl-sponge-500"
        disabled={isLoading}
      >
        {isLoading ? <AiOutlineLoading className="animate-spin" /> : "Submit"}
      </button>
    </FormContext>
  );
};
