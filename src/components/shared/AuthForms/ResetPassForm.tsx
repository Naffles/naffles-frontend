import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";
import { useState } from "react";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { AiOutlineLoading } from "react-icons/ai";
import { strongPasswordRegex } from "@components/utils/strongPasswordRegex";

type RequestPasswordData = {
  emailAddress: string;
};
type ResetPasswordData = {
  tempPassword: string;
  newPassword: string;
};

export const ResetPassForm = () => {
  const { login } = useBasicUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const handleRequestPassword = async (formData: RequestPasswordData) => {
    setIsLoading(true);
    try {
      const {
        data: { message },
      } = await axios.post("user/request-temporary-password", {
        email: formData.emailAddress,
      });
      setEmailAddress(formData.emailAddress);
      setIsNext(true);
      setIsError(false);
      setErrorMessage("");
      alert(message || "Temporary password has been sent to your email");
    } catch (err: any) {
      setIsError(true);
      switch (err?.response?.status) {
        case 429:
          setErrorMessage("Too many requests, please try again later");
          break;
        case 404:
        case 400:
          setErrorMessage(err?.response?.data?.message);
          break;
        default:
          setErrorMessage("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (formData: ResetPasswordData) => {
    if (!strongPasswordRegex.test(formData.newPassword)) {
      setIsError(true);
      return;
    }
    setIsLoading(true);
    try {
      const {
        data: { message },
      } = await axios.post("user/reset-password", {
        email: emailAddress,
        ...formData,
      });
      alert(message || "Your password has been successfully reset.");
      await login({ identifier: emailAddress, password: formData.newPassword });
    } catch (err: any) {
      switch (err?.response?.status) {
        case 429:
          setErrorMessage("Too many requests, please try again later");
          break;
        case 404:
        case 401:
        case 400:
          setErrorMessage(err?.response?.data?.message);
          break;
        default:
          setErrorMessage("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isNext ? (
        <FormContext
          onSubmit={handleRequestPassword}
          className="flex flex-col gap-4 w-64"
        >
          <TextInput
            name="emailAddress"
            label="Email Address"
            placeholder="Email Address"
            required
            errorMessage={errorMessage}
          />
          <Button
            label="submit"
            variant="secondary"
            size="lg"
            type="submit"
            width="span"
          >
            {isLoading ? (
              <AiOutlineLoading className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </FormContext>
      ) : (
        <FormContext
          onSubmit={handleResetPassword}
          className="flex flex-col gap-4 w-64"
        >
          <TextInput
            name="tempPassword"
            label="Temporary Password"
            placeholder="Temporary Password"
            type="password"
            required
          />
          <TextInput
            name="newPassword"
            label="New Password"
            placeholder="New Password"
            type="password"
            required
            minLength={8}
            errorMessage={errorMessage}
          />
          {isError && (
            <label className="text-xs text-nafl-light-red">
              *Strong password must contain at least one Uppercase, Lowercase,
              number and special character
            </label>
          )}
          <Button
            label="submit"
            variant="secondary"
            size="base"
            type="submit"
            width="span"
          >
            {isLoading ? (
              <AiOutlineLoading className="animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </FormContext>
      )}
    </>
  );
};
