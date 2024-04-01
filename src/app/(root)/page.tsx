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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-2 pt-10">
      <div className="w-full">
        <div className="w-full h-[48rem] overflow-hidden">
          <Swiper
            direction="vertical"
            slidesPerView={1}
            spaceBetween={30}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Pagination]}
          >
            {[1, 2, 3, 4].map((item) => (
              <SwiperSlide className="h-[48rem] w-full" key={item}>
                <div className="h-[48rem] w-full bg-nafl-sponge-500 p-10 flex">
                  <div className="w-7/12">
                    <div className="mt-24">
                      <h1 className="text-[2.2rem] md:text-[5rem] lg:text-[6rem] uppercase leading-[2rem] md:leading-[5rem] text-nafl-charcoal-800 tracking-tight">
                        Win Raffles for
                        <span className="text-nafl-jade-500 !font-mono">
                          {" "}
                          <br />
                          Life-changing
                        </span>{" "}
                        nfts
                      </h1>
                      <p className="text-body-lg text-nafl-charcoal-800 py-4">
                        Win NFTs raffled by our community of trusted degens,
                        where profits can be verifiably-fair and fun for
                        everyone. Please degen responsibly!
                      </p>
                      <Button
                        size="base"
                        variant={"primary"}
                        label="Explore"
                        leftIcon={<MagnifyingIcon size="sm" colour="black" />}
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                  <div className="w-5/12">
                    <div className="relative flex">
                      <Image
                        src={"/static/hero-img1.png"}
                        alt="Naffle"
                        width={350}
                        height={350}
                        objectFit="cover"
                        className="absolute top-0 left-4"
                        style={{ zIndex: 2 }}
                      />
                      <Image
                        src={"/static/hero-img2.png"}
                        alt="Naffle"
                        width={290}
                        height={290}
                        objectFit="cover"
                        className="absolute top-8 left-56"
                        style={{ zIndex: 1 }}
                      />
                    </div>
                    <div className="mt-[26rem] flex flex-col ml-[10rem]">
                      <div className="border-t border-nafl-charcoal-300 my-4 w-64 opacity-35"></div>
                      <div className="flex-row flex justify-between pt-3 w-72 mt-3 px-1">
                        <div className="flex-1 justify-center">
                          <h4 className="text-lg font-semibold text-nafl-charcoal-500">
                            Floor price
                          </h4>
                          <div className="flex">
                            <Image
                              src="/static/eth-logo.png"
                              alt="nafl-coin"
                              width={20}
                              height={20}
                              style={{ objectFit: "contain" }}
                            />
                            <h2 className="text-3xl font-semibold text-nafl-charcoal-500 text-right">
                              1.01
                            </h2>
                          </div>
                          <Typography
                            className="text-sm font-semibold ml-5"
                            color="accent-green"
                          >
                            ($3,542 USD)
                          </Typography>
                        </div>
                        <div className="h-[7rem] bg-nafl-charcoal-300 w-0.5 opacity-25 mx-10"></div>
                        <div className="flex-1 ">
                          <div className="flex-1 justify-center">
                            <h4 className="text-lg font-semibold text-nafl-charcoal-500">
                              tickets from
                            </h4>
                            <div className="flex">
                              <Image
                                src="/static/eth-logo.png"
                                alt="nafl-coin"
                                width={20}
                                height={20}
                                style={{ objectFit: "contain" }}
                              />
                              <h2 className="text-3xl font-semibold text-nafl-charcoal-500 text-right">
                                0.01
                              </h2>
                            </div>
                            <Typography
                              className="text-sm font-semibold ml-5"
                              color="accent-green"
                            >
                              ($16 USD)
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="top-[-6rem] relative">
          <CardCarousel />
        </div>
      </div>
      <div className="w-full px-24 bg-nafl-grey-800 h-[1014px]">
        <div className="flex-row flex border-4 border-nafl-purple rounded-lg bg-nafl-charcoal-800">
          <Swiper
            spaceBetween={50}
            slidesPerView={5}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
              <SwiperSlide key={item}>
                <div className="flex-row flex justify-between pt-3 w-72 mt-3 px-6">
                  <TrophyIcon size="lg" colour="dark-green" />
                  <Typography size="text-lg" color="yellow">
                    Winner! Eddie just won 0.3ETH ($969.19) from Jay
                  </Typography>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </main>
  );
}
