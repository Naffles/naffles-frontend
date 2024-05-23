import AscensiveAssets from "@components/icons/ascensiveAssets";
import EighteenPlus from "@components/icons/eighteenPlus";
import NafflesIcon from "@components/icons/nafflesIcon";

import Footer from "@components/shared/Footer/Footer";
import Link from "next/link";
const WinTheJackpot = () => {
  return (
    <>
    <div className="flex flex-col items-center w-full h-screen pt-28 px-8 overflow-hidden mt-[80px]">
      <div className="flex-row flex justify-between w-[900px] lg:flex sm:hidden xs:hidden">
        <div className="flex flex-row">
          <span className="mt-4 mr-5">
            <NafflesIcon colour="white"/>
          </span>
          <span>
            <EighteenPlus size={75}/>
          </span>
        </div>
        <div className="flex flex-row">
          <span className="mx-2">
            <AscensiveAssets colour="white" />
          </span>
          
          <span className="mx-2">
            <img
              src="/static/HGLS_white.png"
              alt="HGLS_white"
              className="w-[130px] h-[120px] object-contain top-[-15px] relative mx-5"
            />
          </span>
          <span className="mx-2">
            <img
              src="/static/Apexblocklogo.png"
              alt="HGLS_white"
              className="w-[130px] h-[120px] object-contain top-[-15px] relative ml-2"
            />
          </span>

        </div>
      </div>
      <div className="text-left my-5 lg:min-w-[900px] xs:min-w-[330px]">
        <span className="text-nafl-purple font-face-bebas text-title-4xl text-left block">
          STAKING DETAILS
        </span>
      </div>

      <div className="w-full max-w-[900px] max-h-[1200px] h-5/6 mt-4 text-nafl-white overflow-auto font-face-roboto text-body-base font-bold">
        <br />
        <p className="italic text-large my-3">
          How does the jackpot grow?
        </p>
        <br />
        <p className="text-small">
          The jackpot will accrue Nafflings (or tokens) as interactions on the Naffles platform increases.  Every activity performed by users will grow the jackpot incrementally - everything from playing a demo game, to betting crypto, buy tickets or running your own raffles.  Nafflings will be added to the jackpot at various rates depending on the activity.
        </p>
        <br />
        <p className="italic text-large my-3">
          How can I enter the jackpot?
        </p>
        <br />
        <p className="text-small">
        Jackpot draws will be duration based, which means draws will be run every day, week or month depending on demand.  Entry to the jackpot is through several methods:
        </p>
        <br />
        <div className="flex flex-row">
          <p className="text-small">1</p>
          <p className="ml-4 text-small">
          The Nafflings that you collect will infiltrate our systems to give you chances to win.  The more Nafflings you have, the better your chance of winning. 
          <br />
          <span className="text-nafl-purple text-small">Moarr activity = Moarr Nafflings = Moarr entries. Simples!</span>
          </p>
        </div>
        <br />
        <div className="flex flex-row">
          <p className="text-small">2</p>
          <p className="ml-4 text-small">
          Holders of staked founders keys will be given passive entry into the jackpot giveaways, based on the duration of staking. A % of entries into the jackpot draw will be allocated to founders key stakers, which will be distributed amongst staked holders, pro-rata based on the staking duration.
          </p>
        </div>
        <br />
        <div className="flex flex-row">
          <p className="text-small">3</p>
          <p className="ml-4 text-small">
          Holders of staked elevation passes will be given pass entry into the jackpot giveaways based on the tier of the Elevation pass.  A % of entries into the jackpot giveaways will be allocated to Elevation pass stakers, which will be distributed amongst stakers, pro-rata based on the tier. Higher tiers will get more entries.
          </p>
        </div>
        <br />
      </div>
    </div>

    <div className="flex flex-col items-center bg-[#181818] pt-[20px] mt-[120px]">
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
              href="/privacy-policy"
              target="_blank"
            >
              PRIVACY POLICY
            </a>
          </p>
          <p className="text-[#626262] font-face-bebas">|</p>
          <p className="text-[#626262] font-face-bebas">
            <a
              href="/terms-and-conditions"
              target="_blank"
            >
              TERMS OF USE
            </a>
          </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default WinTheJackpot;
