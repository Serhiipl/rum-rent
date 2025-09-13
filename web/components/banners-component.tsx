"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Banner } from "@/lib/types";
// import useServiceStore, { Banner } from "@/lib/serviceStore";

// interface HeroCarouselProps {
//   banners: Banner[];
// }

const HeroCarousel: React.FC = () => {
  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Banner[] = await res.json();
        setBanners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        Brak dostępnych banerów
      </div>
    );
  }
  return (
    <section className="relative w-full h-72 sm:h-[30rem] mb-3 sm:my-5 overflow-hidden rounded-lg shadow-lg">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full [--swiper-navigation-color:#fe9a00] [--swiper-pagination-color:#fe9a00]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative ">
            {banner.imageUrl ? (
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority
                sizes="80vw"
                className="object-contain h-72 sm:h-[30rem] w-full"
              />
            ) : (
              <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center text-gray-500 text-xl">
                Brak obrazu
              </div>
            )}
            <div className="absolute inset-0  flex flex-col justify-center items-center text-center text-white px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {banner.title}
              </h2>
              {banner.description && (
                <p className="mb-4 text-lg max-w-2xl">{banner.description}</p>
              )}
              {banner.ctaText && banner.ctaLink && (
                <a
                  href={banner.ctaLink}
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded transition"
                >
                  {banner.ctaText}
                </a>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroCarousel;
