import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { FormContext, TextInput } from "../Inputs";
import DeleteIcon from "@components/icons/deleteIcon";
import axios from "@components/utils/axios";
import { Button } from "../Button";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { Spinner, divider } from "@nextui-org/react";
import { strongPasswordRegex } from "../../utils/strongPasswordRegex";
import { useForm } from "react-hook-form";
import { IoIosCloseCircleOutline, IoMdAddCircleOutline } from "react-icons/io";
import { useUser } from "@blockchain/context/UserContext";
import WalletTypeModal from "../Modal/WalletTypeModal";
import toast from "react-hot-toast";
import { AiOutlineLoading } from "react-icons/ai";

export type ProfileSubmitData = { username: string; email: string };

type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

declare global {
  interface Window {
    ethereum: any;
    web3: any;
    solana: any;
  }
}

export const ProfileForm = () => {
  const { user, reloadProfile, updateProfile } = useBasicUser();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChangePasswordShowed, setIsChangePasswordShowed] =
    useState<boolean>(false);
  const [passwordCheckErrors, setPasswordCheckErrors] = useState<string[]>([]);
  const { resetField } = useForm();
  const [profileEmail, setProfileEmail] = useState<string>("");
  const [profileUsername, setProfileUsername] = useState<string>("");
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    setProfileUsername(user?.username);
    setProfileEmail(user?.email);
    setWalletAddresses(user?.walletAddresses);
  }, [user]);

  useEffect(() => {
    if (user?.username == profileUsername) {
      setIsChanged(false);
    } else setIsChanged(true);
  }, [user, profileUsername]);

  useEffect(() => {
    if (user?.email == profileEmail) {
      setIsChanged(false);
    } else setIsChanged(true);
  }, [user, profileEmail]);

  useEffect(() => {
    setImageUrl(user?.profileImageUrl);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsHovered(false);
    setIsLoading((prev) => !prev);
    const file = event?.target?.files?.[0];
    if (file) {
      setIsChanged(true);
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
    setIsLoading((prev) => !prev);
  };

  const handleChangePassword = async (data: ChangePasswordData) => {
    setIsLoading((prev) => !prev);
    if (data.newPassword !== data.confirmPassword) {
      !passwordCheckErrors.includes(
        "New password and confirm password do not match"
      ) &&
        setPasswordCheckErrors((prev) => [
          ...prev,
          "New password and confirm password do not match",
        ]);
      return;
    }
    if (data.newPassword.length < 8) {
      !passwordCheckErrors.includes("Password must be at least 8 characters") &&
        setPasswordCheckErrors((prev) => [
          ...prev,
          "Password must be at least 8 characters",
        ]);
      return;
    }
    if (!strongPasswordRegex.test(data.newPassword)) {
      !passwordCheckErrors.includes(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ) &&
        setPasswordCheckErrors((prev) => [
          ...prev,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ]);
      return;
    }
    const changePasswordRequest = {
      currentPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    setPasswordCheckErrors([]);

    try {
      const result = await axios.post(
        "user/update-password",
        changePasswordRequest
      );
      if (result.status == 200) {
        toast.success("password update successful");
        setIsChangePasswordShowed(false);
      } else {
        toast.error("password update failed");
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      toast.error(`Error updating password: ${errorData.message}`);
    }

    setTimeout(() => {
      setIsLoading((prev) => !prev);
    }, 1000);
  };

  const handleUpload = () => {
    // console.log("Image uploaded:", imageFile);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileUsername(e.target.value);
    setIsChanged(
      e.target.value !== user?.username || profileEmail !== user?.email
    );
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileEmail(e.target.value);
    setIsChanged(
      profileUsername !== user?.username || e.target.value !== user?.email
    );
  };

  const handleProfileEditSubmit = () => {
    setIsLoading((prev) => !prev);
    const form = new FormData();
    // console.log("form username:", profileUsername);
    // console.log("form email:", profileEmail);
    if (profileUsername != user?.username && profileUsername)
      form.append("username", profileUsername);
    if (profileEmail != user?.email && profileEmail) {
      form.append("email", profileEmail);
      toast("Verification link sent to email", {
        duration: 5000,
        icon: "✉️",
      });
    }
    if (imageFile) form.append("file", imageFile);
    updateProfile(form);
    setTimeout(() => {
      setIsLoading((prev) => !prev);
    }, 2000);
  };

  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [showChooseWalletType, setShowChooseWalletType] =
    useState<boolean>(false);

  const shortenWalletAddress = (address: string) => {
    if (address?.length > 10) {
      return address.slice(0, 11) + "..." + address.slice(-13, address.length);
    } else return address;
  };

  const removeWallet = async (walletAddress: string) => {
    // setWalletAddresses((oldData) =>
    //   oldData.filter((item) => item !== walletAddress)
    // );
    try {
      const result = await axios.delete("user/profile/wallet", {
        data: { address: walletAddress },
      });

      if (result.status === 200) {
        // onConnectionSuccess(publicKey.toString())
        reloadProfile();
        toast.success("wallet removed");
      } else toast.error("error removing wallet please try again");
      // console.log(result);
    } catch (error: any) {
      const errorData = error.response?.data;
      toast.error(`Error removing wallet: ${errorData.message}`);
    }
  };

  if (isChangePasswordShowed) {
    return (
      <FormContext
        onSubmit={handleChangePassword}
        className="flex flex-col items-start h-auto"
      >
        <div className="flex flex-col w-[330px] items-center">
          <div className="my-3 w-full">
            <TextInput
              name="oldPassword"
              label="Old Password"
              type="password"
              placeholder="Old Password"
            />
          </div>
          <div className="my-3 w-full">
            <TextInput
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="New Password"
            />
          </div>
          <div className="my-3 w-full">
            <TextInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <div className="flex flex-col">
            {passwordCheckErrors.map((error, index) => (
              <label key={index} className="text-nafl-sys-error text-sm">
                {error}
              </label>
            ))}
          </div>
          <div className="flex flex-row w-[330px] justify-between mt-3">
            <Button
              label="submit"
              variant="secondary"
              size="sm"
              width="inhert"
              onClick={() => setIsChangePasswordShowed(false)}
            >
              Back
            </Button>
            <Button
              label="submit"
              variant="secondary"
              size="sm"
              type="submit"
              width="inhert"
            >
              {isLoading ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </div>
        </div>
      </FormContext>
    );
  } else
    return (
      <FormContext
        onSubmit={handleProfileEditSubmit}
        className="flex flex-col md:items-start items-center h-auto w-full"
      >
        <WalletTypeModal
          show={showChooseWalletType}
          setShow={setShowChooseWalletType}
        />
        <div className="flex md:flex-row flex-col items-center gap-[5px] md:pl-[20px] w-full">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className={`w-[120px] h-[120px] cursor-pointer opacity-0 absolute top-0 left-0 z-10 text-nafl-white ${
                imageFile && "bg-gray-200 rounded-full"
              }`}
              onChange={handleChange}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
            <div
              className={`w-[120px] h-[120px] bg-cover bg-center rounded-full overflow-hidden relative z-0 ${
                !imageFile && "bg-gray-300"
              }`}
              style={{
                backgroundImage: `url(${imageUrl || "/static/default_img.png"})`,
              }}
              onClick={handleUpload}
            >
              <div
                className={`flex items-center justify-center h-full text-nafl-white text-[16px] bg-black bg-opacity-30 rounded-full transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                Click to upload
              </div>
            </div>
          </div>
          <div className="flex flex-col m-5 gap-4 w-full">
            <div className="w-full h-[54px] relative">
              <p className="absolute top-0 left-[5px] text-nafl-white text-[10px] italic">
                Username:
              </p>
              <input
                type="text"
                name="username"
                placeholder="New Username"
                value={profileUsername}
                onChange={handleUsernameChange}
                className="flex w-full h-full rounded-[10px] border-[1px] border-nafl-sponge-500 text-nafl-white bg-[#4B4B4B] pt-[19px] px-[12px] truncate font-face-roboto"
              />
            </div>
            <div className="w-full h-[54px] relative">
              <p className="absolute top-0 left-[5px] text-nafl-white text-[10px] italic">
                Email:
              </p>
              <input
                type="email"
                name="email"
                placeholder="New Email"
                value={profileEmail}
                onChange={handleEmailChange}
                className="flex w-full h-full rounded-[10px] border-[1px] border-nafl-sponge-500 text-nafl-white bg-[#4B4B4B] pt-[19px] px-[12px] truncate font-face-roboto"
              />
            </div>
            <div className="w-full flex flex-row items-center justify-end mt-[-14px]">
              <p
                onClick={() => setIsChangePasswordShowed(true)}
                className="flex text-nafl-white text-[10px] italic cursor-pointer"
              >
                Change Password
              </p>
            </div>
            {/* <TextInput
            name="username"
            label="Username"
            placeholder={user?.username ? user.username : "New Username"}
          /> 
          <Button
            label="Change Password"
            variant="secondary"
            size="sm"
            onClick={() => setIsChangePasswordShowed(true)}
          >
            Change Password
          </Button>*/}
          </div>
        </div>
        <div className="w-full min-h-[150px] md:px-[20px] px-[0px]">
          <div className="flex flex-col w-full mt-3 items-center rounded-[10px] border-[1px] border-nafl-sponge-500 bg-[#4B4B4B] relative pt-[24px] pb-[4px] pl-[30px] pr-[10px] h-full">
            <p className="absolute top-0 left-[5px] text-nafl-white text-[10px] italic">
              Connected Wallets:
            </p>
            <div className="flex flex-col w-full h-[120px] overflow-hidden overflow-y-scroll wallets-scrollbar pr-[5px]">
              {/* not input, but a row displaying the wallet address plus delete icon button in the right of it */}
              <div className="flex flex-col gap-[9px] w-full items-center justify-start">
                {" "}
                {walletAddresses?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center justify-between w-full"
                  >
                    <p className="md:text-[16px] text-[12px] text-nafl-white">
                      {shortenWalletAddress(item)}
                    </p>
                    <IoIosCloseCircleOutline
                      onClick={() => removeWallet(item)}
                      className="text-[24px] text-nafl-white cursor-pointer"
                    />
                  </div>
                ))}
                <div
                  className="flex flex-row items-center justify-center gap-[6px] mb-[20px]"
                  onClick={() => setShowChooseWalletType(true)}
                >
                  <IoMdAddCircleOutline className="text-white text-[24px]" />
                  <p className="font-face-roboto text-nafl-white text-[14px] italic cursor-pointer">
                    {walletAddresses?.length > 0
                      ? "Add a wallet"
                      : "Connect a wallet"}
                  </p>
                </div>
              </div>

              {/* <div className="flex flex-row items-center justify-between w-[300px] mt-1">
            <input
              type="text"
              name="wallet"
              placeholder="0xb794f5ea0...ba74279579268"
              className="border border-black p-2 w-[300px]"
              disabled
            />
            <DeleteIcon
              size="sm"
              colour="yellow"
              className="mt-[2px] ml-3 cursor-pointer"
            />
          </div>
          <div className="flex flex-row items-center justify-between w-[300px] mt-1">
            <input
              type="text"
              name="wallet"
              placeholder="0xb794f5ea0...ba74279579268"
              className="border border-black p-2 w-[300px]"
              disabled
            />
            <DeleteIcon
              size="sm"
              colour="yellow"
              className="mt-[2px] ml-3 cursor-pointer"
            />
          </div>
          <div className="flex flex-row items-center justify-between w-[300px] mt-1">
            <input
              type="text"
              name="wallet"
              placeholder="0xb794f5ea0...ba74279579268"
              className="border border-black p-2 w-[300px]"
              disabled
            />
            <DeleteIcon
              size="sm"
              colour="yellow"
              className="mt-[2px] ml-3 cursor-pointer"
            />
          </div> */}
            </div>
          </div>
        </div>

        <div className="w-full bg-[#FEFF3D] h-[2px] rounded-full my-[25px]"></div>
        <div className="flex flex-col items-center w-full">
          <button
            type="submit"
            className={`flex items-center justify-center font-face-roboto font-bold text-[18px] text-[#000] px-[30px] rounded-[8px] h-[54px] ${isChanged ? "bg-nafl-sponge-500" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!isChanged}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Loading . . .
              </>
            ) : (
              "SAVE"
            )}
          </button>

          {/* <Button
          label="submit"
          variant="secondary"
          size="base"
          type="submit"
          width="inhert"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" />
              Loading . . .
            </>
          ) : (
            "Save"
          )}
        </Button> */}
        </div>
      </FormContext>
    );
};
