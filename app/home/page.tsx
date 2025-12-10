"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function home() {
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Ambil token dari cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  useEffect(() => {
    const token = getCookie("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);

        // Jika expired true → tampilkan modal
        if (data.expired) {
          setShowModal(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-10">
      {/* Menu */}
      <Header></Header>
      <div className="px-6 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Menu</h3>

        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { label: "KTA DIGITAL", icon: "/icons/kta.png" },
            { label: "ARTIKEL", icon: "/icons/artikel.png" },
            { label: "KARYA & BISNIS", icon: "/icons/karya.png" },
            { label: "MARKETPLACE", icon: "/icons/market.png" },
            { label: "INFO DUKA", icon: "/icons/info.png" },
            { label: "STRUKTUR ORGANISASI", icon: "/icons/struktur.png" },
            { label: "DONASI", icon: "/icons/donasi.png" },
            { label: "POINT", icon: "/icons/point.png" },
          ].map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-3 shadow flex flex-col items-center gap-2"
            >
              <img src={m.icon} alt={m.label} className="w-8 h-8" />
              <p className="text-xs font-medium text-gray-700">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="px-6 mt-6">
        <img src="/banner.png" className="w-full" />
      </div>

      {/* Artikel section */}
      <div className="px-6 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <h3 className="text-lg font-bold">
            Ingin Berorganisasi? Ini Cara Berorganisasi
          </h3>
        </div>

        <div className="mt-3 flex gap-4">
          <img
            src="/article1.jpg"
            className="w-32 h-24 object-cover rounded-xl"
          />
          <div>
            <p className="text-gray-800 text-sm font-semibold">
              Ingin Berorganisasi? Ini Cara Berorganisasi
            </p>
            <Button className="p-0 text-green-600 text-sm">
              Baca Selengkapnya
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center">
            <p className="mb-6 text-black">Sudah saatnya iuran 1 tahun</p>
            <Link href="/iuran">
              <Button className="bg-green-500 text-white w-full">
                Iuran Sekarang
              </Button>
            </Link>
            <Link href="/myiuran">
              <Button className="bg-gray-500 text-white w-full">
                Cek Status Iuran
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
