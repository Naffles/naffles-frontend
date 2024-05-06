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
        style={{ overflow: "visible" }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => (
          <SwiperSlide
            key={item}
            style={{
              width: "210px",
              position: "relative",
              overflow: "visible",
            }}
          >
            {index === 3 && (
              <div className="absolute z-40 w-[100px] top-[-96px] right-[-10px]">
                <img src="/nafflings/cigar.png" alt="" />
              </div>
            )}
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
