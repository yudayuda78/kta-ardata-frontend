"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import Header2 from "@/components/Header2";
import Navigation from "@/components/Navigation";

export default function kta() {
  const [isFront, setIsFront] = useState(true); // true = depan (kta-card), false = belakang (kta2)

  const handleFlip = () => {
    setIsFront(!isFront);
  };

  const handleDownload = () => {
    const imageUrl = isFront ? "/kta-card.png" : "/kta2.png";

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [320, 500],
    });

    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      pdf.addImage(img, "PNG", 0, 0, 320, 500);
      pdf.save("KTA.pdf");
    };
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <Header2 title="Kartu Tanda Anggota" />

      {/* Card Container */}
      <div className="px-6 mt-6 flex justify-center">
        <div className="bg-white rounded-xl shadow-lg p-4 w-80 transition-all duration-300">
          <img
            src={isFront ? "/kta-card.png" : "/kta2.png"}
            alt="KTA"
            className="rounded-xl w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl shadow"
        >
          <img src="icons/downloads.png" alt="" />
        </button>
        <button
          onClick={handleFlip}
          className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl shadow"
        >
          <img src="icons/flip.png" alt="" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <Navigation></Navigation>
    </div>
  );
}
