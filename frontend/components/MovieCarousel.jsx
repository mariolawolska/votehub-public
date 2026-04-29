import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useRef } from "react";
import ResponsiveImage from "./ResponsiveImage";

function mapImages(imagesArray) {
  const out = {};
  imagesArray?.forEach((img) => {
    out[img.type] = img.full_url;
  });
  return out;
}

export default function MovieCarousel({ title, movies }) {
  const swiperRef = useRef(null);
  const canLoop = movies.length > 3;

  return (
    <div className="relative w-full overflow-hidden bg-black py-6 ">
      <h2 className="px-20 movie-heading text-xl sm:text-2xl md:text-3xl font-bold mb-6 uppercase tracking-wide text-white px-4 relative inline-block">
        {title}
      </h2>

      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 z-20 bg-gradient-to-r from-black to-transparent"></div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 z-20 bg-gradient-to-l from-black to-transparent"></div>

      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full"
        spaceBetween={8}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        loop={canLoop}
        allowTouchMove={false}
        speed={9000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        freeMode={true}
      >
        {movies.map((movie) => {
          const images = mapImages(movie.images);

          return (
            <SwiperSlide
              key={movie.id}
              onMouseEnter={() => swiperRef.current?.autoplay.stop()}
              onMouseLeave={() => swiperRef.current?.autoplay.start()}
            >
              <div className="relative group overflow-hidden rounded-md">
                <ResponsiveImage
                  images={images}
                  alt={movie.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* TITLE */}
                <div
                  className="
            absolute left-0 right-0 top-4 text-center text-3xl font-light tracking-widest
            opacity-0 group-hover:opacity-90 translate-y-[-10px] group-hover:translate-y-0
            transition-all duration-500 ease-out px-4
          "
                  style={{
                    WebkitTextStroke: "1px white",
                    color: "transparent",
                  }}
                >
                  {movie.title}
                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    (window.location.href = `/product/${movie.id}`)
                  }
                  className="
            absolute left-1/2 bottom-[15px] -translate-x-1/2
            px-5 py-2.5 rounded-lg text-sm font-semibold
            text-white border border-[var(--primary)]
            opacity-0 group-hover:opacity-100 transition-all duration-300
          "
                >
                  View Details
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
