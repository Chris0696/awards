"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-creative";
import Image from "next/image";

import ArrowLeftIcon from "@/assets/arrowLeft.svg";
import SecondaryArrowRightIcon from "@/assets/secondaryArrowRight.svg";
import QuoteIcon from "@/assets/quote.svg";
import TestimonialCard from "./TestimonialCard";

import { useRef } from "react";

export default function TestimonialsSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="md:py-10">
      <div className="grid grid-cols-4">
        <div className="mb-3 md:mb-0 md:h-[400px] flex items-center col-span-4 md:col-span-1">
          <div className=" md:w-sm pl-8 md:pl-28">
            <div className="">
              <h2 className=" font-bold text-4xl text-primary">
                <span className="md:block">
                  Ils ont tenté l&apos;aventure...
                </span>
                <span className="text-secondary ">et ils racontent</span>
              </h2>
              <div className="hidden md:flex space-x-6 mt-5">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="cursor-pointer"
                >
                  <Image src={ArrowLeftIcon} alt="Arrow left" />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="cursor-pointer"
                >
                  <Image src={SecondaryArrowRightIcon} alt="Arrow Right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className=" relative  h-[400px] col-span-4 md:col-span-3">
          <Image
            src={QuoteIcon}
            alt="Quote icon"
            className="hidden md:block absolute top-0 left-24"
          />
          <div className="  bg-primary md:h-[95%] w-full md:w-3/4 p-6 ml-auto flex items-center">
            <Swiper
              slidesPerView={2}
              spaceBetween={20}
              centeredSlides={true}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="mySwiper"
            >
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SwiperSlide key={i}>
                    <TestimonialCard />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
