"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Clock, Phone, Map, Mail } from "lucide-react";
import { sliderOne, sliderTwo, sliderThree } from "@/assets/slider";

const Banner = () => {
  const [dotActive, setDotActive] = useState(0);
  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    speed: 1000,
    beforeChange: (prev: any, next: any) => {
      setDotActive(next);
    },
    appendDots: (dots: any) => (
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "67%",
          transform: "translate(-50%, 0)",
        }}
      >
        <ul
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i: any) => (
      <div
        style={
          i === dotActive
            ? {
                width: "50px",
                height: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                background: "#fff",
                cursor: "pointer",
              }
            : {
                width: "50px",
                height: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                background: "#4a5568",
                cursor: "pointer",
              }
        }
      ></div>
    ),
  };
  return (
    <div className="lg:min-h-screen relative">
      <Slider {...settings}>
        <div className="w-full py-32 lg:py-0 lg:h-screen bg-gray-100 relative">
        <div className="w-full lg:w-1/3 hidden lg:inline-block h-full bg-green-600 z-0 relative overflow-hidden">
            <Image
              src={sliderOne}
              alt="Fresh Snails"
              className="absolute object-cover h-full w-full"
              priority
            />
          </div>
          <div className="lg:absolute lg:top-1/2 lg:left-2/3 transform lg:-translate-x-1/2 lg:-translate-y-1/2 flex flex-col items-center gap-5">
            <p className="text-xl uppercase">Discover our quality snails</p>
            <p className="w-96 text-center text-gray-600">
              Explore our selection of fresh snails, carefully prepared for your greatest gustatory pleasure.
            </p>
            <p className="text-2xl font-semibold">Fresh Snails</p>
            <button className="text-base font-medium text-white bg-green-600 rounded-md px-4 py-2 hover:bg-green-700">
              Discover our products
            </button>
          </div>
        </div>
        <div className="w-full py-32 lg:py-0 lg:h-screen bg-gray-100 relative">
          <div className="w-full lg:w-1/3 hidden lg:inline-block h-full bg-green-700 z-0 relative">
            <Image
              src={sliderTwo}
              alt="Prepared Snails"
              className="absolute object-cover right-0 lg:-right-48 h-full"
              loading="lazy"
            />
          </div>
          <div className="lg:absolute lg:top-1/2 lg:left-2/3 transform lg:-translate-x-1/2 lg:-translate-y-1/2 flex flex-col items-center gap-5">
            <p className="text-xl uppercase">Traditional recipes</p>
            <p className="w-96 text-center text-gray-600">
              Savor our snails prepared according to authentic recipes passed down from generation to generation.
            </p>
            <p className="text-2xl font-semibold">Prepared Snails</p>
            <button className="text-base font-medium text-white bg-green-600 rounded-md px-4 py-2 hover:bg-green-700">
              Explore our recipes
            </button>
          </div>
        </div>
        <div className="w-full py-32 lg:py-0 lg:h-screen bg-gray-100 relative">
          <div className="w-full lg:w-1/3 hidden lg:inline-block h-full bg-green-700 z-0 relative">
            <Image
              src={sliderThree}
              alt="Gourmet Gift Sets"
              className="absolute object-cover right-0 lg:-right-80 h-full"
              loading="lazy"
            />
          </div>
          <div className="lg:absolute lg:top-1/2 lg:left-2/3 transform lg:-translate-x-1/2 lg:-translate-y-1/2 flex flex-col items-center gap-5">
            <p className="text-xl uppercase">Give an original gift</p>
            <p className="w-96 text-center text-gray-600">
              Discover our gourmet gift sets, perfect for pleasing food lovers.
            </p>
            <p className="text-2xl font-semibold">Gourmet Gift Sets</p>
            <button className="text-base font-medium text-white bg-green-600 rounded-md px-4 py-2 hover:bg-green-700">
              View gift sets
            </button>
          </div>
        </div>
      </Slider>
      <div className="h-20 bg-white absolute left-1/2 -bottom-10 transform -translate-x-1/2 hidden lg:inline-flex items-center gap-x-12 p-10">
        <div className="flex items-center gap-5 w-60">
          <Clock className="text-green-600 w-8 h-8" />
          <div>
            <p>Monday - Saturday</p>
            <p className="font-semibold">9:00 AM - 6:00 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-5 w-60">
          <Phone className="text-green-600 w-8 h-8" />
          <div>
            <p>+33 1 23 45 67 89</p>
            <p className="font-semibold">Order by phone</p>
          </div>
        </div>
        <div className="flex items-center gap-5 w-60">
          <Map className="text-green-600 w-8 h-8" />
          <div>
            <p>Burgundy, France</p>
            <p className="font-semibold">Our address</p>
          </div>
        </div>
        <div className="flex items-center gap-5 w-60">
          <Mail className="text-green-600 w-8 h-8" />
          <div>
            <p>contact@snails.com</p>
            <p className="font-semibold">Contact us</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;