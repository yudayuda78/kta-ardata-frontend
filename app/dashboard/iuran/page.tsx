"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Iuran() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State modal delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch Data
  const loadData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/iurandonasi", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data");

      const json = await res.json();
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData().then(() => setLoading(false));
  }, []);

  // DELETE API
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://127.0.0.1:8000/api/iurandonasi/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Gagal menghapus data");

      // Tutup modal + reload list
      setShowModal(false);
      setDeleteId(null);
      await loadData();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const statusColor: Record<string, string> = {
    berhasil: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    batal: "bg-red-100 text-red-600",
  };

  if (loading) return <p>Memuat data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <div className="space-y-8">
        {/* Search + Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center w-full max-w-xl bg-white rounded-full px-4 py-2 shadow">
            <Search className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari daftar iuran dan donasi..."
              className="w-full px-3 py-1 outline-none"
            />
          </div>

          <button className="p-3 bg-green-100 text-green-600 rounded-full">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex gap-6 border-b pb-3">
            <Tab active label="Semua" count={data.length} />
            <Tab
              label="Iuran"
              count={data.filter((x) => x.tipe === "iuran").length}
            />
            <Tab
              label="Donasi"
              count={data.filter((x) => x.tipe === "donasi").length}
            />
          </div>

          {/* Table */}
          <table className="w-full mt-4">
            <thead className="text-black text-sm">
              <tr className="border-b">
                <th className="py-3 text-left font-semibold">Mark</th>
                <th className="py-3 text-left font-semibold">Nama</th>
                <th className="py-3 text-left font-semibold">Tipe</th>
                <th className="py-3 text-left font-semibold">Jumlah</th>
                <th className="py-3 text-left font-semibold">Metode</th>
                <th className="py-3 text-left font-semibold">Tanggal</th>
                <th className="py-3 text-left font-semibold">Status</th>
                <th className="py-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-black">
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">
                    <div className="w-5 h-5 border rounded-md"></div>
                  </td>

                  <td className="py-4">{item.user?.name}</td>

                  <td className="py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                      {item.tipe}
                    </span>
                  </td>

                  <td className="py-4">Rp {item.jumlah.toLocaleString()}</td>
                  <td className="py-4">{item.metode}</td>
                  <td className="py-4">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm capitalize ${
                        statusColor[item.status] || "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-4 text-green-600 flex gap-2">
                    <a
                      href={`/dashboard/iuran/${item.id}`}
                      className="hover:underline"
                    >
                      Lihat
                    </a>
                    <button
                      className="hover:underline text-red-500"
                      onClick={() => {
                        setDeleteId(item.id);
                        setShowModal(true);
                      }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center px-2 py-4 text-gray-600 text-sm">
            <p>Menampilkan {data.length} data Iuran & Donasi</p>
          </div>
        </div>
      </div>

      {/* Modal Delete */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow">
            <h2 className="text-lg text-black font-semibold mb-3">
              Yakin ingin menghapus data ini?
            </h2>
            <p className="text-gray-600 mb-6">
              Data yang dihapus tidak dapat dikembalikan.
            </p>

            <div className="flex justify-center gap-4 text-black">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                Batal
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------- */
/* Tab Component                      */
/* ---------------------------------- */

function Tab({
  label,
  count,
  active,
}: {
  label: string;
  count: number;
  active?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-2 pb-2 border-b-2 ${
        active
          ? "border-green-600 text-green-600 font-semibold"
          : "border-transparent"
      }`}
    >
      {label}
      <span
        className={`px-2 py-0.5 rounded-full text-sm ${
          active ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
