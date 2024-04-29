import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
export type ProfileSubmitData = { username: string };
type ProfileFormProps = {
  handleSubmit: (data: any) => any;
};

export const ProfileForm = (props: ProfileFormProps) => {
  const { handleSubmit } = props;
  return (
    <FormContext onSubmit={handleSubmit} className="flex flex-col m-5 gap-4">
      <TextInput name="username" label="Username" placeholder="New Username" />
      <Button
        label="submit"
        variant="secondary"
        size="sm"
        type="submit"
        width="inhert"
      >
        Edit
      </Button>
    </FormContext>
  );
};
