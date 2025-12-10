"use client";

import { useEffect, useState, useRef } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Header() {
  interface User {
    name: string;
    alamat?: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ambil token di cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  // hapus token dari cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
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
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  // klik di luar dropdown untuk menutup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    const token = getCookie("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(() => {
        deleteCookie("token");
        setUser(null);
        router.push("/login");
      })
      .catch(() => alert("Logout gagal!"));
  };

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

        {/* Avatar */}
        <div className="ml-auto relative">
          <div
            className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="/navigation/user.svg"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-36 bg-white text-black rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
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
