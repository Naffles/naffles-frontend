import { Swiper, SwiperSlide } from "swiper/react";
import Card from "../Card/card";
import { Navigation } from "swiper/modules";

const CardCarousel = ({ children }: any) => {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={25}
        slidesPerView={"auto"}
        navigation={true}
        modules={[Navigation]}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
          <SwiperSlide key={item} style={{ width: "210px" }}>
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
  );
};

export default CardCarousel;
