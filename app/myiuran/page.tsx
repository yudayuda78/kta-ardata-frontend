"use client";
import { useState, useEffect } from "react";
import Header2 from "@/components/Header2";

interface IuranData {
  id: number;
  user_id: number;
  nama: string;
  tipe: string;
  jumlah: number;
  metode: string;
  status: string;
  created_at: string;
  updated_at: string;
  periode: string;
}

export default function Iuran() {
  const [iuran, setIuran] = useState<IuranData[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userId, setUserId] = useState("");
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
        setUserId(data.id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) return;
    if (!userId) return; // tunggu sampai userId tersedia

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/iurandonasiuser/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setIuran(data.data.data);
        setTotalAmount(data.data.total_amount);
      })
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <Header2 title="Iuran Saya" />

      {/* Total Iuran Terbayar */}
      <div className="bg-white p-4 rounded-b-2xl mb-3 shadow-md w-full flex justify-between items-center">
        <span className="text-black font-medium">Total Iuran Terbayar :</span>
        <span className="text-black font-semibold text-lg">
          Rp {totalAmount.toLocaleString("id-ID")}
        </span>
      </div>

      {/* List Iuran/Donasi */}
      <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
        {iuran.map((item) => (
          <div
            key={item.id}
            className={`bg-white p-4 rounded-2xl shadow-md w-full flex justify-between items-center`}
          >
            {/* Periode dan jumlah */}
            <div className="flex flex-col">
              <p className="text-gray-700 font-medium">
                Periode: <span className="font-semibold">{item.periode}</span>
              </p>
              <p className="text-green-600 font-semibold">
                Rp {item.jumlah.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Status pembayaran di samping */}
            <div
              className={`text-white px-4 py-2 rounded-2xl font-medium text-center ${
                item.status === "paid" ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {item.status === "paid" ? "Sudah dibayar" : "Pending"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
