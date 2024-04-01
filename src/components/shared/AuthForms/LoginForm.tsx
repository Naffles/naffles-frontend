import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";

export const LoginForm = () => {
  const onSubmit = () => alert("login clicked");
  return (
    <FormContext onSubmit={onSubmit} className="flex flex-col gap-4 min-w-64">
      <TextInput
        name="emailAddress"
        label="Email Address"
        placeholder="Email Address"
      />
      <TextInput
        name="emailAddress"
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
