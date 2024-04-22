import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '../Card/card';
import { Navigation } from 'swiper/modules';

const CardCarousel = ({ children }: any) => {
  return (
    <div className="w-full px-4">
    <Swiper
      spaceBetween={50}
      slidesPerView={7}
      navigation={true}
      modules={[Navigation]}
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
  )
};

export default CardCarousel;
