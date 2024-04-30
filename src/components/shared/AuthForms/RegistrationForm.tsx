import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";
import { useState } from "react";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { AiOutlineLoading } from "react-icons/ai";

type RegistrationFormData = {
  emailAddress: string;
  password: string;
  verificationCode: string;
};

export const RegistrationForm = () => {
  const { login } = useBasicUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [previousData, setPreviousData] = useState<RegistrationFormData | null>(
    null
  );
  const [showNext, setShowNext] = useState(false);
  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(prev => !prev);
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
        setIsError(true);
      }
    }
    setIsLoading(prev => !prev);
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
      {
        isError && (
          <label className="text-xs text-[#ecc8c8]">
            Something went wrong in verification.
          </label>
        )
      }
      <Button
        label="submit"
        variant="secondary"
        size="lg"
        type="submit"
        width="inhert"
        className="mx-2 my-2"
      >
        {
          isLoading ? <AiOutlineLoading className="animate-spin" /> : "Submit"
        }
      </Button>
    </FormContext>
  );
};
