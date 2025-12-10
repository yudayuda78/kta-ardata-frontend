"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";

export default function Header() {
  interface User {
    name: string;
    alamat?: string;
  }

  const [user, setUser] = useState<User | null>(null);

  // ambil token di cookie
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
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-green-500 text-white rounded-b-3xl p-6 pt-10 relative overflow-hidden">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="w-12 h-12" />

        <div>
          <h2 className="text-xl font-semibold">
            Hallo, {user ? user.name : "Memuat..."}
          </h2>
          <p className="text-sm opacity-90">
            Selamat datang, {user ? user.name : "Memuat..."}
          </p>
        </div>

        <div className="ml-auto w-10 h-10 rounded-full bg-white/40 flex items-center justify-center">
          <img src="/avatar.png" alt="User" className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white mt-5 rounded-full px-4 py-2 flex items-center justify-between shadow">
        <span className="text-gray-700 text-sm">
          {user?.alamat || "Lokasi tidak diketahui"}
        </span>
        <Button className="bg-green-500 text-white rounded-full px-3 py-1">
          Ganti
        </Button>
      </div>
    </div>
  );
}
