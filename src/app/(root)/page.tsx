"use client";

import PageHeader from "@components/shared/PageHeaders/PageHeader";
import CardCarousel from "@components/shared/CardCarousel/CardCarousel";
import TrophyIcon from "@components/icons/trophyIcon";
import Typography from "@components/shared/Typography/typography";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-2 pt-10">
      <div className="w-full">
        <div className="w-full h-144 overflow-hidden">
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
              {[1, 2, 3, 4, 5].map((item) => (
                <SwiperSlide className="h-144 w-full" key={item}>
                  <div className="h-144 w-full bg-nafl-sponge-500 p-10">
                    Slide {item}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

        </div>
        <CardCarousel />
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
                <TrophyIcon
                  size="lg"
                  colour="dark-green"
                />
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
