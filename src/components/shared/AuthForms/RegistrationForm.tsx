import { FormContext, TextInput } from "../Inputs";
import { Button } from "../Button";
import { useState } from "react";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { AiOutlineLoading } from "react-icons/ai";
import { strongPasswordRegex } from "@components/utils/strongPasswordRegex";
import validator from "validator";
import toast from "react-hot-toast";

type RegistrationFormData = {
  emailAddress: string;
  password: string;
  verificationCode: string;
};
export const RegistrationForm = () => {
  const { login } = useBasicUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [previousEmail, setPreviousEmail] = useState("");
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [previousData, setPreviousData] = useState<RegistrationFormData | null>(
    null
  );
  const [showNext, setShowNext] = useState(false);
  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading((prev) => !prev);
    if (!showNext) {
      setPreviousData(data);
      if (!strongPasswordRegex.test(data.password)) {
        setIsError(true);
        setIsLoading((prev) => !prev);
        return;
      }
      if (!isEmailValid) {
        if (emailError) {
          toast.error("Invalid email address");
        }
        setIsLoading((prev) => !prev);
        return;
      }
      if (emailError) {
        toast.error("Email has already been used");
        setIsLoading((prev) => !prev);
        return;
      }
      try {
        await axios.post("user/send-email-verification", {
          email: data.emailAddress,
          password: data.password,
        });
        setIsError(false);
        setShowNext(true);
      } catch (err) {
        // console.log(err);
        setIsError(true);
      }
    } else {
      try {
        if (previousData?.emailAddress && previousData.password) {
          await axios.post("user/signup", {
            email: previousData.emailAddress,
            password: previousData.password,
            verificationCode: data.verificationCode,
          });
          login({
            identifier: previousData.emailAddress,
            password: previousData.password,
          });
        }
        setIsVerificationSuccess(false);
      } catch (err) {
        // console.log(err);
        setIsVerificationSuccess(true);
      }
    }
    setIsLoading((prev) => !prev);
  };
  const handleEmailBlur = async (email: string) => {
    setIsLoading((prev) => !prev);
    if (!email) {
      setEmailError("");
      setEmailValid("");
    } else {
      if (email && !validator.isEmail(email)) {
        setIsEmailValid(false);
        setEmailError("Enter a valid email.");
        setIsLoading((prev) => !prev);
        return;
      }

      setIsEmailValid(true);
      try {
        const response = await axios.get(`user/search?email=${email}`);
        if (response.data.statusCode === 200) {
          setEmailValid(response.data.message);
          setEmailError(null);
        } else {
          setEmailValid(null);
          setEmailError(response.data.message);
        }
      } catch (error: any) {
        switch (error?.response?.status) {
          case 429:
            setEmailValid(null);
            setEmailError("Too many requests, please try again later");
            break;
          case 404:
          case 401:
          case 400:
            setEmailValid(null);
            setEmailError(error?.response?.data?.message);
            break;
          default:
            setEmailValid(null);
            setEmailError("Something went wrong");
        }
      }
    }
    setIsLoading((prev) => !prev);
  };
  return (
    <FormContext
      onSubmit={onSubmit}
      className="flex flex-col gap-4 w-full mx-auto items-center"
    >
      {!showNext ? (
        <>
          <TextInput
            name="emailAddress"
            label="Email Address"
            placeholder="Email Address"
            required
            onBlur={handleEmailBlur}
          />
          {emailValid && (
            <label className="text-xs text-nafl-sys-done">{emailValid}</label>
          )}
          {emailError && (
            <label className="text-xs text-nafl-light-red">{emailError}</label>
          )}
          <TextInput
            name="password"
            label="Password"
            placeholder="Password*"
            type="password"
            notes=""
            minLength={8}
          />
          {isError && (
            <label className="text-xs text-nafl-light-red">
              *Strong password must contain at least one Uppercase, Lowercase,
              number and special character
            </label>
          )}
        </>
      ) : (
        <TextInput
          name="verificationCode"
          label="Verification Code"
          placeholder="Verification Code"
        />
      )}
      {isVerificationSuccess && (
        <label className="text-xs text-nafl-light-red">
          Something went wrong in verification.
        </label>
      )}
      {/* <Button
        label="submit"
        variant="secondary"
        size="lg"
        type="submit"
        width="span"
      >
        {isLoading ? <AiOutlineLoading className="animate-spin" /> : "Register"}
      </Button> */}
      <button
        type="submit"
        className="flex items-center justify-center text-[#000] text-[18px] h-[45px] md:w-[267px] w-full rounded-[10px] bg-nafl-sponge-500 font-face-roboto font-bold"
        disabled={isLoading}
      >
        {isLoading ? <AiOutlineLoading className="animate-spin" /> : "REGISTER"}
      </button>
    </FormContext>
  );
};
