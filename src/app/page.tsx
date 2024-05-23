"use client";

import { useEffect, useRef, useState } from "react";
import CardCarousel from "@components/shared/CardCarousel/CardCarousel";
import TrophyIcon from "@components/icons/trophyIcon";
import Typography from "@components/shared/Typography/typography";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Button from "@components/shared/Button/button";
import MagnifyingIcon from "@components/icons/magnifyingIcon";
import Image from "next/image";
import Footer from "@components/shared/Footer/Footer";
import CollectionItem from "@components/shared/Collection/collection";
import { GameSection } from "@components/GameSection";
import { IoMdSearch } from "react-icons/io";
import { jackpotAmount, jackpotWinners } from "@components/utils/jackpotCounter";

export default function Home() {
  const [jackpotTotalAmount, setJackpotTotalAmount] = useState<any>(0);
  const [jackpotWinnersArr, setJackpotWinnersArr] = useState<any>([]);

  useEffect(() => {
    jackpotWinners(4).then(winners => {
      setJackpotWinnersArr(winners);
      console.log(jackpotWinnersArr, 'jackpotWinnersArr')
    });
  }, []);
  
  // const jackpotWinnerArr = async () => {
  //   const arr = await jackpotWinners(4);
  //   console.log(arr, 'jackpot winner arr');
  //   return arr;
  // }
    
  const intervalSet = useRef(false);
  useEffect(() => {
    const fetchInitialJackpot = async () => {
        try {
            const initialAmount = await jackpotAmount('nafflings');
            setJackpotTotalAmount(initialAmount.jackpotInitial);
            if (!intervalSet.current) {
                intervalSet.current = true;
                const interval = setInterval(() => {
                    setJackpotTotalAmount((prevAmount: number) => prevAmount + initialAmount.jackpotPointPerSec);
                }, 10000);

                return () => {
                    clearInterval(interval);
                    intervalSet.current = false;
                };
            }
        } catch (error) {
            console.error('Failed to fetch initial jackpot amount:', error);
        }
    };
    fetchInitialJackpot();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-0 translate-y-[-30px]">
      <div className="w-full bg-[#464646] px-[25px] h-[110vh] md:h-[1200px] xl:h-[950px] pt-[100px]">
        <Swiper
          className="flex w-full  "
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          pagination={{
            clickable: true,
            type: "bullets",
          }}
          modules={[Pagination]}
        >
          {/* grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 */}
          {jackpotWinnersArr.map((item: any) => (
            <SwiperSlide
              className="w-full bg-nafl-sponge-500 rounded-[16px] xl:pt-0 pt-[50px] xl:pb-[100px] px-4 md:px-10"
              key={item.id}
            >
              <div className="flex xl:flex-row flex-col items-center justify-center w-full h-full gap-[50px]">
                <div className="xl:w-[1000px] lg:w-[700px] w-[90%] flex flex-col items-start justify-center 2xl:pl-0 xl:pl-[20px] pl-0">
                  <p className="xl:text-[125px] text-[60px] text-[#000] font-face-bebas leading-[110%]">
                    Wager & Win{" "}
                    <span className="text-[#00b3b2] font-face-bebas">
                      Life-changing
                    </span>{" "}
                    nfts &{" "}
                    <span className="relative font-face-bebas">
                      Crypto
                      <div className="absolute w-[100px] md:w-[130px] top-[-90px] lg:top-[-108px] right-[-10px]">
                        <img src="/nafflings/surprise2.png" alt="" />
                      </div>
                    </span>
                  </p>
                  <div className="flex flex-col gap-[15px]">
                    <p className="text-[16px] md:text-[25px] text-nafl-charcoal-800 w-[80%] md:w-[100%]">
                      Win Raffles and Play PVP games against our community of
                      trusted degens, where profits can be verifiably-fair and
                      fun for everyone. Please degen responsibly!
                    </p>
                    <div className="relative w-fit flex lg:flex-row flex-col items-center justify-start gap-[16px]">
                      <a href="/gamezone">
                        <button className="px-[32px] bg-[#464646] rounded-[8px] h-[50px] font-bold tracking-[1px] z-10">
                          <p className="text-[#FEFF3D]"> PLAY OUR GAMES</p>
                        </button>
                      </a>
                      {/* <button className="px-[32px] bg-[#464646] rounded-[8px] h-[50px] font-bold tracking-[1px] z-10">
                        <p className="text-[#FEFF3D]">EXPLORE LIVE NAFFLES</p>
                      </button> */}
                      <div className="absolute w-[150px] right-[35px] top-[-20px] z-[-1]">
                        <img src="/nafflings/surprise3.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center md:scale-100 scale-[.6] py-0 md:py-[100px]">
                  <div>
                    <p className="text-[#371143] text-[32px] uppercase font-mono translate-x-[30%]">
                      Jackpot Winner!!
                    </p>
                    <div className="bg-[#371143] h-[98px] w-[370px] rounded-[16px] relative flex items-center justify-center">
                      <div className="translate-x-[20%]">
                        <div className="flex items-center gap-[7px]">
                          <img src={item.userProfileImage.length > 0 ? item.userProfileImage : "/static/avatar.svg"} alt="" />
                          <p className="font-mono text-white">
                          {item.walletAddress.slice(0, 4)}...{item.walletAddress.slice(-6)} !!
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[48px] text-nafl-sponge-500 leading-[100%]">
                            {item.wonAmount}{" "}
                            <span className="text-[20px] text-white font-mono">
                              NAFFLINGS
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="w-[320px] object-contain absolute top-[-135px] left-[-140px] shake">
                        <div className="relative flex justify-center">
                          <img
                            src="/static/jackpot-img.png"
                            alt="Jackpot Image"
                            className="z-1"
                          />
                          <img
                            src="/nafflings/chest-group.png"
                            alt=""
                            className="absolute top-[125px] z-20 w-[120px] drop-shadow-nafl-sponge-2xl "
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[480px] mt-[80px] pr-0 md:pr-10">
                    <div className="space-y-4 border-b-[1px] border-black border-opacity-[50%] pb-5">
                      <p className="font-sans text-black opacity-[70%]">
                        <span className="font-bold">EVERY</span> game, ticket
                        and action on Naffles earns you entries into the
                        Jackpot. You don’t even need to gamble to win.{" "}
                        <span className="font-bold">Play now!</span>
                      </p>
                      <p className="font-mono uppercase text-[24px] text-[#02B1B1]">
                        NEXT JACKPOT GIVE AWAY IN{" "}
                        <span className="text-[#DC2ABF] font-mono">5 days</span>
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex gap-[10px]">
                        <p className="font-mono text-[15px] text-black">
                          like & share
                        </p>
                        <img src="/static/twitter.svg" alt="" />
                        <img src="/static/discord.svg" alt="" />
                      </div>
                      <a href="/gamezone">
                        {" "}
                        <button className="flex items-center justify-center gap-[12px] w-[167px] h-[51px] border-[2px] border-[#FEFF3D] rounded-[11px] bg-gradient-to-r from-[#DC2ABF] to-[#00E0DF]">
                          <p className="text-[24px] text-[#fff] font-face-bebas leading-[100%]">
                            PLAY NOW..
                          </p>
                          <img
                            src="/static/play-now-icon.png"
                            alt="Play Now Image"
                            className="w-[44px] object-contain"
                          />
                        </button>
                      </a>
                    </div>
                  </div>
                  {/* <>
                    <div className="flex flex-row items-center justify-center">
                      <Image
                        src={"/static/hero-img1.png"}
                        alt="Naffle"
                        width={316}
                        height={380}
                        className="mr-[-20%]"
                        style={{ zIndex: 2, objectFit: "contain" }}
                      />
                      <Image
                        src={"/static/hero-img2.png"}
                        alt="Naffle"
                        width={290}
                        height={290}
                        sizes="290px"
                        className="ml-[-18%]"
                        style={{ zIndex: 1, objectFit: "contain" }}
                      />
                    </div>
                    <p className="text-[50px] text-[#464646] font-face-bebas leading-[100%] mb-[30px]">
                      VEEFRIENDS
                    </p>
                    <div className="flex flex-col items-center justify-center">
                      <div className="border-t border-nafl-charcoal-300 my-4 w-64 opacity-35"></div>
                      <div className="flex-row flex justify-between">
                        <div className="flex flex-col items-start w-[190px] py-[5px] gap-[2px] border-r-[1px] border-[#000]/20">
                          <p className="text-[16px] font-face-bebas text-[#464646] leading-[100%] ml-[50px]">
                            TICKETS PRICE
                          </p>
                          <div className="flex flex-row items-center justify-center w-full gap-[8px]">
                            <img
                              src="/static/eth-logo.png"
                              alt="ETH Logo"
                              className="w-[25px] object-contain"
                            />
                            <p className="text-[33px] font-face-bebas text-[#464646] leading-[100%]">
                              0.005
                            </p>
                          </div>

                          <p className="flex items-center justify-center w-full text-[16px] font-face-bebas text-[#02B1B1] leading-[100%]">
                            ($ 16 USD)
                          </p>
                        </div>
                        <div className="flex flex-col items-start w-[190px] py-[5px] gap-[2px]">
                          <p className="text-[16px] font-face-bebas text-[#464646] leading-[100%] ml-[50px]">
                            TICKETS FROM
                          </p>
                          <div className="flex flex-row items-center justify-center w-full gap-[8px]">
                            <img
                              src="/static/eth-logo.png"
                              alt="ETH Logo"
                              className="w-[25px] object-contain"
                            />
                            <p className="text-[33px] font-face-bebas text-[#464646] leading-[100%]">
                              0.005
                            </p>
                          </div>

                          <p className="flex items-center justify-center w-full text-[16px] font-face-bebas text-[#02B1B1] leading-[100%]">
                            ($ 16 USD)
                          </p>
                        </div>
                      </div>
                    </div>
                  </> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <div className="flex relative top-[-60px] px-[30px]">
          <CardCarousel />
        </div> */}
      </div>
      <div className="w-full lg:px-24 md:px-5 xs:px-5 sm:px-5 bg-nafl-grey-800 pb-[50px] relative">
        <div className="absolute top-[-143px] right-[120px] z-10 w-[97px]">
          <img src="/nafflings/cigar.png" alt="" />
        </div>
        <div
          className="flex-row flex border-4 border-nafl-purple 
        rounded-lg bg-nafl-charcoal-800 relative top-[-50px] z-10"
        >
          <Swiper
            spaceBetween={50}
            slidesPerView={"auto"}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
              <SwiperSlide key={item} style={{ width: "290px" }}>
                <div className="flex-row flex justify-between py-2 w-full mt-2">
                  {item % 2 === 0 ? (
                    <TrophyIcon size="xl" colour="dark-green" />
                  ) : (
                    <TrophyIcon size="xl" colour="purple" />
                  )}
                  <Typography
                    size="text-lg"
                    color={item % 2 === 0 ? "purple" : "dark-green"}
                  >
                    Winner!{" "}
                    <span
                      style={{ fontFamily: "Bebas Neue", color: "#FEFF3D" }}
                    >
                      Eddie just won
                    </span>{" "}
                    0.3ETH ($969.19) from Jay
                  </Typography>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-[40px] lg:mb-[20px] mb-[50px]">
          <p className="text-[62px] text-[#fff] font-face-bebas">GAME ZONE</p>
          <a href="/gamezone">
            <button className="flex items-center justify-center gap-[12px] w-[167px] h-[51px] border-[2px] border-[#FEFF3D] rounded-[11px] bg-gradient-to-r from-[#DC2ABF] to-[#00E0DF]">
              <p className="text-[24px] text-[#fff] font-face-bebas leading-[100%]">
                PLAY NOW..
              </p>
              <img
                src="/static/play-now-icon.png"
                alt="Play Now Image"
                className="w-[44px] object-contain"
              />
            </button>
          </a>
        </div>
        <GameSection />
      </div>
      <div className="items-center justify-center w-full lg:px-24 bg-nafl-grey-600 h-auto p-5 hidden flex-col pb-[150px] pt-[80px] gap-[50px]">
        <div className="relative">
          <div className="absolute w-[60px] md:w-[103px] top-[-14px] md:top-[-50px] left-[30px] md:left-[120px]">
            <img src="/nafflings/hottest.png" alt="" />
          </div>
          <h1 className="text-[2.2rem] md:text-[5rem] lg:text-[6rem] uppercase leading-[2rem] md:leading-[5rem] text-nafl-white tracking-tight text-center mt-10">
            Hottest collections
          </h1>
        </div>
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center xl:w-[1300px] lg:w-[1000px] w-[90%]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <CollectionItem
                title="Boared Ape"
                description="Yacht Club"
                price="$9.99"
                buttonText="Buy Now"
                notchColor="bg-nafl-grey-600"
              />
            </div>
          ))}
        </div>
        {/* a button with a label explore all our collections with a yellow background */}
        <button className="bg-nafl-yellow-500 text-[#464646] lg:text-[19px] text-[16px] p-2 rounded-lg mx-auto mt-10 flex items-center justify-center mb-10 font-face-roboto uppercase font-bold gap-[10px] px-[32px]">
          {/* <MagnifyingIcon size="sm" colour="yellow" /> */}
          <IoMdSearch className="text-[30px]" />
          Explore all our collections
        </button>
      </div>

      <Footer />
    </main>
  );
}
