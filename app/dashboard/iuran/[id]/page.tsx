"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function IuranDetail() {
  const { id } = useParams();
  const numericId = Number(id);

  type StatusType = "berhasil" | "pending" | "batal";

  const [item, setItem] = useState<any>(null);
  const [status, setStatus] = useState<StatusType>("pending");
  const [loading, setLoading] = useState(true);

  const statusMap: Record<StatusType, string> = {
    berhasil: "paid",
    pending: "pending",
    batal: "cancelled",
  };

  // Fetch detail by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://127.0.0.1:8000/api/iurandonasi/${numericId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          console.error("Fetch error:", res.status);
          return;
        }

        const result = await res.json();

        // API format: data.data = array
        const found = result?.data?.data?.find((d: any) => d.id === numericId);

        setItem(found || null);
        if (found) setStatus(found.status);
      } catch (err) {
        console.error("Error fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numericId]);

  if (loading) return <p>Mengambil data...</p>;
  if (!item) return <p className="text-red-500">Data tidak ditemukan…</p>;

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const statusMap: Record<StatusType, string> = {
        berhasil: "paid",
        pending: "pending",
        batal: "cancelled",
      };

      const res = await fetch(
        `http://127.0.0.1:8000/api/iurandonasi/${numericId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: statusMap[status], // kirim status API
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("API Error:", err);
        alert("Gagal mengubah status!");
        return;
      }

      alert("Status berhasil diubah menjadi PAID!");
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <div className="space-y-8 text-black">
      {/* Back */}
      <Link
        href="/dashboard/iuran"
        className="flex items-center gap-2 text-green-600 hover:underline"
      >
        <ArrowLeft size={18} /> Kembali
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold">Detail Iuran / Donasi</h1>

      {/* Card */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6 max-w-3xl">
        <DetailRow label="Keterangan" value={item.nama} />
        <DetailRow label="Tipe" value={item.tipe} />
        <DetailRow
          label="Jumlah"
          value={`Rp. ${item.jumlah.toLocaleString()}`}
        />
        <DetailRow label="Metode" value={item.metode} />
        <DetailRow
          label="Tanggal"
          value={new Date(item.created_at).toLocaleDateString("id-ID")}
        />
        <DetailRow label="Periode" value={item.periode} />

        {/* Editable Status */}
        <div className="flex justify-between border-b pb-4">
          <p className="font-semibold">Status</p>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusType)}
            className="border p-2 rounded-lg"
          >
            <option value="berhasil">Berhasil</option>
            <option value="pending">Pending</option>
            <option value="batal">Batal</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Simpan Status
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------ */
/* Inline Component */
/* ------------------------------------ */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-3">
      <p className="font-semibold">{label}</p>
      <p>{value}</p>
    </div>
  );
}
