"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function Welcome() {
  const [slide, setSlide] = useState(0);
  const [fade, setFade] = useState(true);

  const slides = [
    {
      img: "logo.svg",
      title: "Selamat Datang",
      desc: "Di Aplikasi Organisasi Nasional ABCDEFGH Digital",
    },
    {
      img: "lonceng.svg",
      title: "Selamat Datang",
      desc: "Nikmati layanan informasi organisasi serta fitur pendukung aktivitas komunitas",
    },
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setFade(false);

      setTimeout(() => {
        setSlide(slide + 1);
        setFade(true);
      }, 250);
    }
  };

  const handleSkip = () => {
    console.log("Lewati onboarding");
  };

  return (
    <div className="bg-white h-screen w-screen flex flex-col items-center justify-between px-6 py-10 text-center">
      {/* SLIDE CONTENT */}
      <div
        className={`
          flex-1 flex flex-col items-center justify-center
          transition-all duration-300
          ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        `}
      >
        <img
          src={slides[slide].img}
          alt="Slide"
          className="w-40 max-w-xs mb-6 transition-all duration-300"
        />

        {slides[slide].title && (
          <h1 className="text-2xl text-black font-semibold mb-4">
            {slides[slide].title}
          </h1>
        )}

        <p className="text-base text-gray-700 max-w-md">{slides[slide].desc}</p>
      </div>

      {/* DOT INDICATOR */}
      <div className="flex gap-2 mb-6">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${
                slide === index
                  ? "bg-green-600 scale-110"
                  : "bg-gray-300 scale-90"
              }
            `}
          ></div>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="w-full max-w-xs flex flex-col gap-3 mb-4">
        {slide < slides.length - 1 ? (
          <Button color="green" onClick={handleNext}>
            Lanjut
          </Button>
        ) : (
          <Button color="green" onClick={() => console.log("Mulai!")}>
            Mulai
          </Button>
        )}

        <Button color="gray" onClick={handleSkip}>
          Lewati
        </Button>
      </div>
    </div>
  );
}
