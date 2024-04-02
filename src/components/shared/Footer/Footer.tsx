"use client";

const Footer = () => {
  return (
    <>
      <div className="w-full h-[557px] bg-[#292929] relative pt-[67px] z-50">
        <div className="flex flex-row w-full items-start justify-between px-[270px]">
          <img
            src="/static/naffles-text-logo.png"
            alt="Naffles Text Logo"
            className="w-[350px] object-contain mt-[54px]"
          />

          <div className="flex flex-col items-start justify-center w-[569px]">
            <p className="text-[42px] text-[#fff] font-face-bebas">
              BE EARLY. BE READY.
            </p>
            <p className="text-[#BDBDBD] text-[19px]">
              Give us your email and we’ll give you free stuff and notifications
              when we drop{" "}
              <a href="" className="text-nafl-sponge-500 font-face-roboto">
                real degen raffles
              </a>
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

        <div className="flex flex-row items-center justify-between w-full h-[120px] absolute bottom-0 bg-[#181818] px-[270px] text-[23px]">
          <p className="text-[#626262] font-face-bebas">
            © Copyright 2022 naffles All Rights Reserved.
          </p>

          <div className="flex flex-row items-center justify-center gap-[6px]">
            <p className="text-[#626262] font-face-bebas">PRIVACY POLICY</p>
            <p className="text-[#626262] font-face-bebas">|</p>
            <p className="text-[#626262] font-face-bebas">TERMS OF USE</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
