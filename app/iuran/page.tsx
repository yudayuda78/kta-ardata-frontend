"use client";
import { useState, useEffect } from "react";
import Header2 from "@/components/Header2";
import { useRouter } from "next/navigation";

export default function Iuran() {
  const router = useRouter();
  const [useCustom, setUseCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [inputNama, setInputNama] = useState(""); // untuk input nama
  const [userId, setUserId] = useState<number | null>(null);
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      console.warn("Token kosong");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.id);
        setInputNama(data.name);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = () => {
    const jumlah = useCustom ? Number(customAmount) : 2000000; // preset Rp 2.000.000

    if (!userId) return alert("User tidak ditemukan");

    const payload = {
      user_id: userId,
      nama: inputNama,
      tipe: "iuran", // bisa diubah sesuai kebutuhan
      jumlah: jumlah,
      metode: "transfer",
      status: "pending",
    };

    const token = getCookie("token");
    if (!token) {
      console.warn("Token kosong");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/iurandonasi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const iuranId = data.data.id;

        router.push(`/payment?iuran_id=${iuranId}`);
      })
      .catch(console.error);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-20">
      <Header2 title="Iuran Tahunan Periode 2025" />

      <div className="bg-white p-4 rounded-b-2xl shadow-md mx-auto w-full max-w-md flex flex-col items-start gap-1">
        <h2 className="text-black font-semibold text-lg">Pembayaran Iuran</h2>
        <h2 className="text-black text-sm">{inputNama} | Nomor</h2>
        <div className="border-b border-gray-300 w-full mt-2"></div>

        <h2 className="text-black text-sm mt-2">Jumlah Kirim</h2>
        <form className="w-full flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="amount"
              value="preset"
              checked={!useCustom}
              onChange={() => setUseCustom(false)}
              className="w-4 h-4"
            />
            <span className="text-black">Rp 2.000.000</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="amount"
              value="custom"
              checked={useCustom}
              onChange={() => setUseCustom(true)}
              className="w-4 h-4"
            />
            <span className="text-black">Masukkan jumlah lain</span>
          </label>

          {useCustom && (
            <input
              type="number"
              placeholder="Masukkan jumlah lain"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            />
          )}

          <input
            type="text"
            value={inputNama}
            onChange={(e) => setInputNama(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          />
        </form>
      </div>

      <div className="bg-white p-4 mt-1 rounded-b-2xl shadow-md mx-auto w-full max-w-md flex flex-col items-start gap-2">
        <h2 className="text-black font-semibold text-lg">
          Petunjuk Pembayaran
        </h2>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li>Transfer sesuai nominal yang diinginkan</li>
          <li>Gunakan nomor rekening di bawah ini</li>
          <li>Simpan bukti transfer Anda</li>
          <li>Klik tombol “Konfirmasi” untuk konfirmasi</li>
        </ol>
        <h2 className="text-black font-semibold text-sm mt-3">
          Butuh bantuan? Hubungi Customer Service
        </h2>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="w-full max-w-md bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}
