"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { Clock, Phone, Map, Mail } from "lucide-react";
import { sliderOne, sliderTwo, sliderThree } from "@/assets/slider";
import styles from './Product.module.css'; 

const Banner = () => {
  const [dotActive, setDotActive] = useState(0);

  const categories = [
    { title: "Escargots Frais", href: "/escargots-frais", categoryId: 1 },
    { title: "Escargots Préparés", href: "/escargots-prepares", categoryId: 2 },
    { title: "Coffrets Gourmands", href: "/coffrets-gourmands", categoryId: 5 },
  ];

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
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
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
                background: "#fff",
                cursor: "pointer",
              }
            : {
                width: "50px",
                height: "6px",
                background: "#4a5568",
                cursor: "pointer",
              }
        }
      ></div>
    ),
  };

  return (
    <div className="h-screen relative">
      <Slider {...settings}>
        {[sliderOne, sliderTwo, sliderThree].map((slide, index) => (
          <div
            key={index}
            className="w-full h-screen bg-gray-100 flex flex-col lg:flex-row"
          >
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden">
              <Image
                src={slide}
                alt={`Diapositive ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
              />
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col justify-center items-center p-6 lg:absolute lg:top-1/2 lg:left-2/3 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2">
              <p className={`text-xl uppercase text-center ${styles.textCustomColor}`}>
                {index === 0 && "Découvrez nos escargots de qualité"}
                {index === 1 && "Recettes traditionnelles"}
                {index === 2 && "Offrez un cadeau original"}
              </p>
              <p className="text-center text-gray-600 max-w-lg mt-3">
                {index === 0 &&
                  "Explorez notre sélection d'escargots frais, soigneusement préparés pour votre plus grand plaisir gustatif."}
                {index === 1 &&
                  "Savourez nos escargots préparés selon d'authentiques recettes transmises de génération en génération."}
                {index === 2 &&
                  "Découvrez nos coffrets cadeaux gourmands, parfaits pour faire plaisir aux amateurs de bonne chère."}
              </p>
              <p className="text-2xl font-semibold mt-4">
                {index === 0 && "Escargots Frais"}
                {index === 1 && "Escargots Préparés"}
                {index === 2 && "Coffrets Cadeaux Gourmands"}
              </p>
              <Link href={categories[index].href}>
                <button className={`${styles.button} mt-5`}>
                  {index === 0 && "Découvrir nos produits"}
                  {index === 1 && "Explorer nos recettes"}
                  {index === 2 && "Voir les coffrets cadeaux"}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Slider>

      <div className="h-20 bg-white absolute left-1/2 -bottom-10 transform -translate-x-1/2 hidden lg:flex items-center gap-x-12 p-10 shadow-lg rounded-lg">
        <div className="flex items-center gap-5 w-60">
          <Clock className={`${styles.price} w-8 h-8`} />
          <div>
            <p>Lundi - Samedi</p>
            <p className="font-semibold">9h00 - 18h00</p>
          </div>
        </div>
        <div className="flex items-center gap-5 w-60">
          <Phone className={`${styles.price} w-8 h-8`} />
          <div>
            <p>+33 1 23 45 67 89</p>
            <p className="font-semibold">Commandez par téléphone</p>
          </div>
        </div>
        <div className="flex items-center gap-5 w-60">
          <Map className={`${styles.price} w-8 h-8`} />
          <div>
            <p>Bourgogne, France</p>
            <p className="font-semibold">Notre adresse</p>
          </div>
        </div>
        <div className="flex items-center gap-5 w-60">
          <Mail className={`${styles.price} w-8 h-8`} />
          <div>
            <p>contact@escargots.com</p>
            <p className="font-semibold">Contactez-nous</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
