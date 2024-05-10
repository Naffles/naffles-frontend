import { FaDiscord, FaTwitter } from "react-icons/fa";

const Footer = () => {
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

          <div className="ml-embedded" data-form="ZpYFjE"></div>
          <div className="flex flex-col items-start justify-center md:w-[569px] max-w-[569px] w-[90%]">
            <p className="text-[42px] text-[#fff] font-face-bebas">
              BE EARLY. BE READY
            </p>
            <p className="text-[#BDBDBD] text-[19px]">
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
              />
              <button className="absolute right-[6px] flex items-center justify-center w-[138px] h-[57px] rounded-[10px] bg-nafl-sponge-500">
                <p className="text-[#000] text-[19px] font-bold">SIGN UP</p>
              </button>
            </div>
            <div className="w-full flex flex-row items-center justify-center mt-[70px] gap-[40px]">
              <a href="https://twitter.com/Nafflesofficial" target="_blank">
                <FaTwitter className="hover:text-nafl-white text-nafl-sponge-500 text-[40px] transition-colors ease-out duration-150 cursor-pointer" />
              </a>
              <a href="https://discord.gg/naffles" target="_blank">
                <FaDiscord className="hover:text-nafl-white text-nafl-sponge-500 text-[40px] transition-colors ease-out duration-150 cursor-pointer" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center bg-[#181818] pt-[20px]">
          <div className="flex flex-col gap-[10px] xl:w-[80%] w-[90%]">
            <p className="text-nafl-white text-[16px] w-full">
              https://naffles.com/ is owned and operated by Degentralised
              Interactive Limited (Registration Number: 2134682) with the
              Registered Address: Intershore Chambers, Road Town, Tortola,
              British Virgin Islands.
            </p>
            <p className="text-nafl-white text-[16px] w-full">
              Contact us nft@naffles.com.
            </p>
            <p className="text-nafl-white text-[16px] w-full">
              naffles.com is licensed and regulated by the Government of the
              Autonomous Island of Anjouan, Union of Comoros and operates under
              License No. ALSI-062403009-F16.
            </p>
            <p className="text-nafl-white text-[16px] w-full">
              naffles.com has passed all regulatory compliance and is legally
              authorized to conduct gaming operations for any and all games of
              chance and wagering.
            </p>
          </div>
          <div className="flex xl:flex-row flex-col items-center xl:justify-between justify-center w-full h-[120px] xl:px-[270px] text-[23px]">
            <p className="text-[#626262] font-face-bebas">
              © Copyright 2024 naffles All Rights Reserved.
            </p>

            <div className="flex flex-row items-center justify-center gap-[6px]">
              {/* if privacy policy is clicked, redirect it to a link like dropbox */}
              <p className="text-[#626262] font-face-bebas">
                <a
                  href="https://www.dropbox.com/scl/fo/u6y3v0p1kofxnmhvv7ch8/ABPQNjicw5_4X0ODKxOiyQs?dl=0&e=1&preview=KYC+Policy+-+Naffles.pdf&rlkey=l65w2x8kelxew1lonehmey1ud"
                  target="_blank"
                >
                  PRIVACY POLICY
                </a>
              </p>
              <p className="text-[#626262] font-face-bebas">|</p>
              <p className="text-[#626262] font-face-bebas">
                <a
                  href="https://www.dropbox.com/scl/fi/9ek0y9v7qzqszngel43rd/Terms-and-Conditions.docx?rlkey=8lf7pe02nilm12qhee5fw5su1&e=1&dl=0"
                  target="_blank"
                >
                  TERMS OF USE
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="xs:flex md:flex sm:flex lg:hidden xl:hidden flex-col w-full h-[557px] bg-[#292929] relative pt-[67px] z-30 bottom-0">
        <div className="relative w-fit mx-auto">
          <img
            src="/static/naffles-text-logo.png"
            alt="Naffles Text Logo"
            className="w-[260px] object-contain mt-[54px] align-middle mx-auto"
          />
          <div className="w-[58px] absolute top-[30px] right-[0px]">
            <img src="/nafflings/surprise4.png" alt="" />
          </div>
        </div>
        <div className="ml-embedded" data-form="ZpYFjE"></div>
        <div className="w-full p-10">
          <div className="flex flex-col items-start justify-center">
            <p className="text-4xl text-[#fff] font-face-bebas">
              BE EARLY. BE READY.aaa
            </p>
            <p className="text-[#BDBDBD] text-[19px]">
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
              />
              <button className="absolute right-[6px] flex items-center justify-center w-[138px] h-[57px] rounded-[10px] bg-nafl-sponge-500">
                <p className="text-[#000] text-[19px] font-bold">SIGN UP</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
