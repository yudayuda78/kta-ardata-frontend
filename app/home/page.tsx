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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
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
      {/* Menu Section */}
      <div className="mt-4 px-6">
        <h2 className="text-black text-lg font-semibold mb-3">Menu</h2>

        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            {
              label: "KTA DIGITAL",
              icon: "/icons/kta.png",
              href: "/kta",
              role: "anggota",
            },
            { label: "ARTIKEL", icon: "/icons/artikel.png", href: "/artikel" },
            {
              label: "KARYA & BISNIS",
              icon: "/icons/karya.png",
              href: "/karya",
            },
            {
              label: "MARKETPLACE",
              icon: "/icons/market.png",
              href: "/marketplace",
            },
            { label: "INFO DUKA", icon: "/icons/info.png", href: "/info" },
            {
              label: "STRUKTUR ORGANISASI",
              icon: "/icons/struktur.png",
              href: "/struktur",
            },
            { label: "DONASI", icon: "/icons/donasi.png", href: "/donasi" },
            { label: "POINT", icon: "/icons/point.png", href: "/point" },
          ]
            .filter((m) => {
              // hanya tampilkan KTA DIGITAL jika role = anggota
              if (m.label === "KTA DIGITAL" && user?.role !== "anggota")
                return false;
              return true;
            })
            .map((m, i) => (
              <Link key={i} href={m.href}>
                <div className="bg-white rounded-2xl p-3 shadow flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition">
                  <img
                    src={m.icon}
                    alt={m.label}
                    className="w-8 h-8 object-contain"
                  />
                  <p className="text-[11px] font-medium text-gray-700 leading-tight">
                    {m.label}
                  </p>
                </div>
              </Link>
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
            <img src="calendar.png" alt="" className="mx-auto block mb-4" />
            <p className="mb-6 text-black">Sudah saatnya iuran 1 tahun</p>
            <Link href="/iuran">
              <Button className=" text-white w-full mb-2" color="green">
                Iuran Sekarang
              </Button>
            </Link>
            <Link href="/myiuran">
              <Button className=" text-white w-full" color="gray">
                Cek Status Iuran
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
