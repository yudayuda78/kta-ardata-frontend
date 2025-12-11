"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header2 from "@/components/Header2";
import { useSearchParams } from "next/navigation";

interface PaymentClientProps {
  paramId?: string;
}

export default function PaymentClient({ paramId }: PaymentClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const iuranId = searchParams.get("iuran_id");

  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("Joko Ardiwinansa");
  const [showForm, setShowForm] = useState(false);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor rekening berhasil disalin!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Silakan pilih gambar");
    const token = getCookie("token");
    const formData = new FormData();
    formData.append("iuran_id", iuranId || "");
    formData.append("image", file);
    formData.append("keterangan", description);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bukti-transfer`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        router.push(`/myiuran`);
        setFile(null);
        setDescription("");
      })
      .catch((err) => {
        console.error(err);
        alert("Upload gagal!");
      });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-20">
      <Header2 title="Metode Pembayaran Tunai" />
      {!showForm ? (
        <div>
          {/* Informasi Rekening */}
          <div className="bg-white p-4 mt-1 rounded-b-2xl shadow-md mx-auto w-full max-w-md flex flex-col items-start gap-2">
            <h2 className="text-black font-semibold text-lg">
              Informasi Rekening
            </h2>
            <ul className="list-inside text-sm text-gray-700 space-y-1">
              <li>Bank Tujuan: Bank Central Asia</li>
              <li className="flex items-center gap-2">
                Nomor Rekening: <span className="font-mono">1234 567 890</span>
                <button
                  type="button"
                  className="bg-gray-200 px-2 py-0.5 text-xs rounded hover:bg-gray-300 transition"
                  onClick={() => copyToClipboard("1234567890")}
                >
                  Copy
                </button>
              </li>
              <li>Atas Nama: Joko Adiwinansa</li>
              <li>Kode Unik: INV-DON-20251208-00123</li>
            </ul>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="w-full max-w-md bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
              onClick={() => setShowForm(true)}
            >
              Selesaikan
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Form Upload */}
          <div className="bg-white p-4 mt-1 rounded-b-2xl shadow-md mx-auto w-full max-w-md flex flex-col gap-3 text-black">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="text-lg font-medium">
                Upload Bukti Pembayaran
              </label>
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />

              {/* Button kustom hijau */}
              <label
                htmlFor="fileInput"
                className="w-full max-w-md h-40 bg-green-500 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-green-600 transition"
              >
                <div className="bg-green-600 h-full w-[80%] mx-auto flex flex-col items-center justify-center">
                  <img src="icons/upload.png" alt="" />
                  {file ? file.name : "Unggah Foto Pembayaran"}
                  <h1>Pilih Gambar(JPG, PNG)</h1>
                </div>
              </label>
              <label className="text-sm font-medium">Dibayarkan Kepada</label>
              <input
                type="text"
                placeholder="Keterangan"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border px-3 py-2"
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="w-full max-w-md bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
              onClick={() => setShowForm(false)}
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
