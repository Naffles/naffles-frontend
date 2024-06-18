import { FaDiscord, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleFormSubmit = async () => {
    if (email) {
      try {
        setIsLoading(true);
        const {
          data: { success, errors },
        } = await axios.post(
          `https://assets.mailerlite.com/jsonp/${process.env.NEXT_PUBLIC_MAILERLITE_ACC_ID}/forms/${process.env.NEXT_PUBLIC_MAILERLITE_FORM_ID}/subscribe`,
          { fields: { email } }
        );
        if (success) {
          toast.success("You have successfully subscribed to our newsletter!");
          setEmail("");
        } else {
          setError(errors?.fields?.email?.join(" "));
        }
        setIsLoading(false);
      } catch (err) {
        toast.error("An error occurred. Please try again later.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://163a3d88-a381-4928-873c-19ebd4bd977d.snippet.anjouangaming.org/anj-seal.js";
    // script.async = true;
    // script.onload;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div className="flex flex-col w-full bg-[#292929] z-20">
        <div className="flex xl:flex-row flex-col w-full items-center justify-center py-[67px] xl:gap-[300px]">
          <div className="relative">
            <img
              src="/static/naffles-text-logo.png"
              alt="Naffles Text Logo"
              className="md:w-[350px] max-w-[350px] w-[90%] object-contain xl:mt-[54px] my-[34px]"
            />
            <div className="w-[58px] absolute top-[20px] lg:top-[20px] xl:top-[40px] right-2">
              <img src="/nafflings/surprise4.png" alt="" />
            </div>
          </div>
          <div className="flex flex-col items-start justify-center md:w-[569px] max-w-[569px] w-[90%]">
            <p className="text-[42px] text-[#fff] font-face-bebas">
              BE EARLY. BE READY
            </p>
            <p className="text-[#BDBDBD] text-[18px]">
              Give us your email and we’ll give you free stuff and notifications
              when we drop{" "}
              <span className="text-nafl-sponge-500 font-face-roboto">
                real degen raffles
              </span>
            </p>
            <div className="flex items-center w-full relative mt-[31px]">
              <input
                type="text"
                placeholder="Stick ya email here"
                className="w-full h-[67px] bg-[#4B4B4B] font-face-roboto text-[23px] rounded-[10px] pl-[23px] pr-[140px] placeholder:text-[#868686]"
                name="fields[email]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="absolute right-[6px] flex items-center justify-center w-[138px] h-[57px] rounded-[10px] bg-nafl-sponge-500"
                type="submit"
                onClick={handleFormSubmit}
              >
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <p className="text-[#000] text-[18px] font-bold">SIGN UP</p>
                )}
              </button>
            </div>
            <div className="w-full flex flex-row items-center justify-center mt-[70px] gap-[40px]">
              <a href="https://twitter.com/Nafflesofficial" target="_blank">
                <FaXTwitter className="hover:text-nafl-white text-nafl-sponge-500 text-[40px] transition-colors ease-out duration-150 cursor-pointer" />
              </a>
              <a href="https://discord.gg/naffles" target="_blank">
                <FaDiscord className="hover:text-nafl-white text-nafl-sponge-500 text-[40px] transition-colors ease-out duration-150 cursor-pointer" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center bg-[#181818] pt-[20px]">
          <div className="flex md:flex-row flex-col items-center justify-center gap-[30px] my-[20px] w-full">
            <div
              id="anj-163a3d88-a381-4928-873c-19ebd4bd977d"
              data-anj-seal-id="163a3d88-a381-4928-873c-19ebd4bd977d"
              data-anj-image-size="75"
              data-anj-image-type="basic-small"
            ></div>
            <div className="flex flex-col max-w-[1280px] md:w-[80%] w-[90%] gap-[12px]">
              <p className="text-[12px] text-[#fff]">
                https://naffles.com/ is owned and operated by Degentralised
                Interactive Limited (Registration Number: 2134682) with the
                Registered Address: Intershore Chambers, Road Town, Tortola,
                British Virgin Islands.
              </p>
              <p className="text-[12px] text-[#fff]">
                Contact us nft@naffles.com.
              </p>
              <p className="text-[12px] text-[#fff]">
                naffles.com is licensed and regulated by the Government of the
                Autonomous Island of Anjouan, Union of Comoros and operates
                under License No. ALSI-062403009-F16.
              </p>
              <p className="text-[12px] text-[#fff]">
                naffles.com has passed all regulatory compliance and is legally
                authorized to conduct gaming operations for any and all games of
                chance and wagering.
              </p>
            </div>
          </div>
          <div className="flex xl:flex-row flex-col items-center xl:justify-between justify-center w-full h-[120px] xl:px-[270px] text-[23px]">
            <p className="text-[#626262] font-face-bebas">
              © Copyright 2024 naffles All Rights Reserved.
            </p>

            <div className="flex flex-row items-center justify-center gap-[6px]">
              {/* if privacy policy is clicked, redirect it to a link like dropbox */}
              <p className="text-[#626262] font-face-bebas">
                <a href="/privacy-policy" target="_blank">
                  PRIVACY POLICY
                </a>
              </p>
              <p className="text-[#626262] font-face-bebas">|</p>
              <p className="text-[#626262] font-face-bebas">
                <a href="/terms-and-conditions" target="_blank">
                  TERMS OF USE
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
