import { useState, ChangeEvent, useEffect } from "react";
import { FormContext, TextInput } from "../Inputs";
import DeleteIcon from "@components/icons/deleteIcon";
import axios from "@components/utils/axios";
import { Button } from "../Button";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
export type ProfileSubmitData = { username: string };

export const ProfileForm = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    const getProfile = async () => {
      const { data } = await axios.get("user/profile");
      const { data: profileImageData } = await axios.get(
        "image/view?path=" + data.data.profileImage,
        { responseType: "arraybuffer" }
      );
      setImageUrl(URL.createObjectURL(new Blob([profileImageData])));

    };
    getProfile();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    console.log("Image uploaded:", imageFile);
  };

  const handleProfileEditSubmit = (data: ProfileSubmitData) => {
    const form = new FormData();
    if (data?.username) form.append("username", data.username);
    if (imageFile) form.append("file", imageFile);
    axios.patch("user/profile", form);
  };
  return (
    <FormContext
      onSubmit={handleProfileEditSubmit}
      className="flex flex-col items-start h-auto"
    >
      <div className="flex flex-row items-center">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            className={`w-[180px] h-[180px] cursor-pointer opacity-0 absolute top-0 left-0 z-10 ${
              imageFile && "bg-gray-200 rounded-full"
            }`}
            onChange={handleChange}
          />
          <div
            className={`w-[180px] h-[180px] bg-cover bg-center rounded-full overflow-hidden relative z-0 ${
              !imageFile && "bg-gray-300"
            }`}
            style={
              !imageUrl
                ? { backgroundImage: `url(/static/nft-dummy.png)` }
                : { backgroundImage: `url(${imageUrl})` }
            }
            onClick={handleUpload}
          >
            {!imageFile && (
              <div className="flex items-center justify-center h-full text-nafl-white bg-black bg-opacity-30 rounded-full">
                Click to upload
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col m-5 gap-4"></div>
        <TextInput
          name="username"
          label="Username"
          placeholder="New Username"
        />
      </div>
      <div className="flex flex-col w-full mt-3 items-center">
        <label htmlFor="wallet" className="text-nafl-white tex-sm mt-5">
          <h5 className="text-nafl-sponge-500 text-sm">Connected Wallet(s)</h5>
        </label>
        <div className="flex flex-col items-center justify-between w-full">
          {/* not input, but a row displaying the wallet address plus delete icon button in the right of it */}
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
        </div>
      </div>
      <div className="flex flex-col items-center w-full pt-2">
        <Button
          label="submit"
          variant="secondary"
          size="base"
          type="submit"
          width="inhert"
        >
          Save Changes
        </Button>
      </div>
    </FormContext>
  );
};
