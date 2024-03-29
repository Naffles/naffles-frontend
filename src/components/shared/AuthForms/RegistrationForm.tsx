import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";

export const RegistrationForm = () => {
  const onSubmit = () => alert("login clicked");
  return (
    <FormContext onSubmit={onSubmit} className="flex flex-col gap-4">
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
        notes="*Strong password must contain at least one Uppercase, Lowercase, number
        and special character"
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
