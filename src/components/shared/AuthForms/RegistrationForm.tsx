import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";
import { useState } from "react";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";

type RegistrationFormData = {
  emailAddress: string;
  password: string;
  verificationCode: string;
};

export const RegistrationForm = () => {
  const { login } = useBasicUser();
  const [previousData, setPreviousData] = useState<RegistrationFormData | null>(
    null
  );
  const [showNext, setShowNext] = useState(false);
  const onSubmit = async (data: RegistrationFormData) => {
    if (!showNext) {
      setPreviousData(data);
      const response = await axios.post("user/send-email-verification", {
        email: data.emailAddress,
      });
      setShowNext(true);
    } else {
      try {
        if (previousData?.emailAddress && previousData.password) {
          const response = await axios.post("user/signup", {
            email: previousData.emailAddress,
            password: previousData.password,
            verificationCode: data.verificationCode,
          });
          login({
            identifier: previousData.emailAddress,
            password: previousData.password,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <FormContext onSubmit={onSubmit} className="flex flex-col gap-4 w-64">
      {!showNext ? (
        <>
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
            notes="*Strong password must contain at least one Uppercase, Lowercase, number
        and special character"
            minLength={8}
          />
        </>
      ) : (
        <TextInput
          name="verificationCode"
          label="Verification Code"
          placeholder="Verification Code"
        />
      )}
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
