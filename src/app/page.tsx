"use client";
import Card from "@components/shared/Card/card";
import PageHeader from "@components/shared/PageHeaders/PageHeader";
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PageHeader
      />
      <div className="w-full">
        <Swiper
          spaceBetween={50}
          slidesPerView={7}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
            <SwiperSlide key={item}>
              <Card
                title="Boared Ape"
                description="Yacht Club"
                price="$9.99"
                buttonText="Buy Now"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </main>
  );
}
