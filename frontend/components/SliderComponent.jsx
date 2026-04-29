import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useEffect } from "react";
import ResponsiveImage from "../components/ResponsiveImage";
import { banners } from "../data/banners";

export default function SliderComponent() {
  // Lazy-load Swiper CSS
  useEffect(() => {
    import("swiper/css");
    import("swiper/css/navigation");
    import("swiper/css/pagination");
  }, []);

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{ 640: { slidesPerView: 2 } }}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
      className="rounded-none md:rounded-lg w-full overflow-hidden bg-gray-100"
    >
      {banners.map(({ name, images }) => (
        <SwiperSlide key={name}>
          <ResponsiveImage
            images={images}
            alt={name}
            className="rounded-none md:rounded-lg w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
