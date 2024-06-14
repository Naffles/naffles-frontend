"use client";

import AscensiveAssets from "@components/icons/ascensiveAssets";
import EighteenPlus from "@components/icons/eighteenPlus";
import NafflesIcon from "@components/icons/nafflesIcon";
import Footer from "@components/shared/Footer/Footer";

const WinTheJackpot = () => {
  return (
    <>
      <div className="flex flex-col items-center w-full h-screen pt-28 px-8 overflow-hidden mt-[80px]">
        <div className="flex-row flex justify-between w-[900px] lg:flex sm:hidden xs:hidden">
          <div className="flex flex-row">
            <span className="mt-4 mr-5">
              <NafflesIcon colour="white" />
            </span>
            <span>
              <EighteenPlus size={75} />
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
          <p className="italic text-large my-3">How does the jackpot grow?</p>
          <br />
          <p className="text-small">
            The jackpot will accrue Nafflings (or tokens) as interactions on the
            Naffles platform increases. Every activity performed by users will
            grow the jackpot incrementally - everything from playing a demo
            game, to betting crypto, buy tickets or running your own raffles.
            Nafflings will be added to the jackpot at various rates depending on
            the activity.
          </p>
          <br />
          <p className="italic text-large my-3">How can I enter the jackpot?</p>
          <br />
          <p className="text-small">
            Jackpot draws will be duration based, which means draws will be run
            every day, week or month depending on demand. Entry to the jackpot
            is through several methods:
          </p>
          <br />
          <div className="flex flex-row">
            <p className="text-small">1</p>
            <p className="ml-4 text-small">
              The Nafflings that you collect will infiltrate our systems to give
              you chances to win. The more Nafflings you have, the better your
              chance of winning.
              <br />
              <span className="text-nafl-purple text-small">
                Moarr activity = Moarr Nafflings = Moarr entries. Simples!
              </span>
            </p>
          </div>
          <br />
          <div className="flex flex-row">
            <p className="text-small">2</p>
            <p className="ml-4 text-small">
              Holders of staked founders keys will be given passive entry into
              the jackpot giveaways, based on the duration of staking. A % of
              entries into the jackpot draw will be allocated to founders key
              stakers, which will be distributed amongst staked holders,
              pro-rata based on the staking duration.
            </p>
          </div>
          <br />
          <div className="flex flex-row">
            <p className="text-small">3</p>
            <p className="ml-4 text-small">
              Holders of staked elevation passes will be given pass entry into
              the jackpot giveaways based on the tier of the Elevation pass. A %
              of entries into the jackpot giveaways will be allocated to
              Elevation pass stakers, which will be distributed amongst stakers,
              pro-rata based on the tier. Higher tiers will get more entries.
            </p>
          </div>
          <br />
        </div>
      </div>

      <Footer />
    </>
  );
};
export default WinTheJackpot;
