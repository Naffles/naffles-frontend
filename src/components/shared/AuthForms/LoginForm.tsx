import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
export type LoginSubmitData = { emailAddress: string; password: string };
type LoginProps = {
  handleLogin: (data: any) => any;
};

export const LoginForm = (props: LoginProps) => {
  const { handleLogin } = props;
  const { login } = useBasicUser();
  const onSubmit = async (data: LoginSubmitData) => {
    const response = await login({
      identifier: data.emailAddress,
      password: data.password,
    });
    handleLogin(response);
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
        notes={<u>Forgot Password?</u>}
      />

      <Button
        label="submit"
        variant="secondary"
        size="lg"
        type="submit"
        width="inhert"
        className="mx-2 my-2"
      >
        Submit
      </Button>
    </FormContext>
  );
};
