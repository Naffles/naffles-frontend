"use client";

import PageHeader from "@components/shared/PageHeaders/PageHeader";
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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-0 lg:pt-[80px] pt-[25px]">
      <div className="w-full bg-[#464646] px-[25px] xl:h-[800px] lg:h-[1200px] md:h-[1200px] h-[1500px] mb-[380px]">
        <Swiper
          className="flex w-full"
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
          {[1, 2, 3, 4].map((item) => (
            <SwiperSlide
              className="w-full bg-nafl-sponge-500 rounded-[16px] xl:pt-0 pt-[50px] xl:pb-[100px]"
              key={item}
            >
              <div className="flex xl:flex-row flex-col items-center justify-center w-full h-full">
                <div className="xl:w-[1000px] lg:w-[700px] w-[90%] flex flex-col items-start justify-center 2xl:pl-0 xl:pl-[20px] pl-0">
                  <p className="xl:text-[125px] text-[100px] text-[#000] font-face-bebas leading-[110%]">
                    Wager & Win{" "}
                    <span className="text-[#00b3b2] font-face-bebas">
                      Life-changing
                    </span>{" "}
                    nfts &{" "}
                    <span className="relative font-face-bebas">
                      Crypto
                      <div className="absolute w-[130px] top-[-112px] lg:top-[-108px] right-[-10px]">
                        <img src="/nafflings/surprise2.png" alt="" />
                      </div>
                    </span>
                  </p>
                  <div className="flex flex-col gap-[15px]">
                    <p className="text-[25px] text-nafl-charcoal-800">
                      Win Raffles and Play PVP games against our community of
                      trusted degens, where profits can be verifiably-fair and
                      fun for everyone. Please degen responsibly!
                    </p>
                    <div className="relative w-fit flex lg:flex-row flex-col items-center justify-start gap-[16px]">
                      <button className="px-[32px] bg-[#464646] rounded-[8px] h-[50px] font-bold tracking-[1px]">
                        <p className="text-[#FEFF3D]"> PLAY OUR GAMES</p>
                      </button>
                      <button className="px-[32px] bg-[#464646] rounded-[8px] h-[50px] font-bold tracking-[1px] z-10">
                        <p className="text-[#FEFF3D]">EXPLORE LIVE NAFFLES</p>
                      </button>
                      <div className="absolute w-[150px] right-[35px] top-[50px] lg:top-[-20px] z-0">
                        <img src="/nafflings/surprise3.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center xl:scale-100 scale-75">
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
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex relative top-[-60px] px-[30px]">
          <CardCarousel />
        </div>
      </div>
      <div className="w-full lg:px-24 md:px-5 xs:px-5 sm:px-5 bg-nafl-grey-800 pb-[50px]">
        <div
          className="flex-row flex border-4 border-nafl-purple 
        rounded-lg bg-nafl-charcoal-800 relative top-[-50px]"
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
                <div className="flex-row flex justify-between pt-3 w-full mt-3 px-6">
                  {item % 2 === 0 ? (
                    <TrophyIcon size="lg" colour="dark-green" />
                  ) : (
                    <TrophyIcon size="lg" colour="purple" />
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
        </div>
        <GameSection />
      </div>
      <div className="items-center justify-center w-full lg:px-24 bg-nafl-grey-600 h-auto p-5 flex flex-col pb-[150px] pt-[80px] gap-[50px]">
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
