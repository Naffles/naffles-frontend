import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";
import { ButtonTypes } from "../Button/button";
import { useEffect, useState } from "react";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { AiOutlineLoading } from "react-icons/ai";
import { useFormContext } from "react-hook-form";

type RegistrationFormData = {
  emailAddress: string;
  password: string;
};
type VerificationFormData = {
  verificationCode: string;
};

export const RegistrationForm = () => {
  const { register, formState } = useFormContext() || {};
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useBasicUser();
  const [previousData, setPreviousData] = useState<RegistrationFormData | null>(
    null
  );
  const [showNext, setShowNext] = useState(false);
  const onSubmit = async (data: RegistrationFormData) => {
    setPreviousData(data);
    setShowNext(true);
    const response = await axios.post("user/send-email-verification", {
      email: data.emailAddress,
    });

    console.log("send email verification response:", response);
  };
  const onSubmitVerification = async (data: VerificationFormData) => {
    try {
      if (previousData?.emailAddress && previousData.password) {
        setIsLoading(true);
        const response = await axios.post("user/signup", {
          email: previousData.emailAddress,
          password: previousData.password,
          verificationCode: data.verificationCode,
        });

        console.log("registration response:", response);

        login({
          identifier: previousData.emailAddress,
          password: previousData.password,
        });
      }
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };
  return (
    <>
      {!showNext ? (
        <FormContext onSubmit={onSubmit} className="flex flex-col gap-4 w-64">
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
      ) : (
        <FormContext
          onSubmit={onSubmitVerification}
          className="flex flex-col gap-4 w-64"
        >
          <TextInput
            name="verificationCode"
            label="Verification Code"
            placeholder="Verification Code"
          />
          <button
            name=""
            type="submit"
            className="flex items-center justify-center text-[#000] h-[45px] w-full rounded-[10px] bg-nafl-sponge-500 mb-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <AiOutlineLoading className="animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
        </FormContext>
      )}
    </>
  );
};
