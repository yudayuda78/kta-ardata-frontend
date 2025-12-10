"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash,
  FiExternalLink,
} from "react-icons/fi";

interface ArticleData {
  id: number;
  judul: string;
  penulis: string;
  image: string;
  tanggal: string;
  artikel: string;
}

interface ArticleCardProps {
  data: ArticleData;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (article: ArticleData) => void;
}

export default function KelolaArtikel() {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);

  const [detailData, setDetailData] = useState<ArticleData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    judul: "",
    penulis: "",
    tanggal: "",
    image: "",
    artikel: "",
  });

  const [showEditModal, setShowEditModal] = useState(false); // ADDED
  const [currentEdit, setCurrentEdit] = useState<ArticleData | null>(null); // ADDED

  // Ambil semua artikel
  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/berita`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Ambil artikel by ID
  const fetchDetail = async (id: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/berita/${id}`
    );
    const data = await res.json();
    setDetailData(data);
    setShowDetailModal(true);
  };

  // Delete Artikel
  const confirmDelete = async () => {
    if (!deleteId) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/berita/${deleteId}`, {
      method: "DELETE",
    });

    setShowDeleteModal(false);
    setDeleteId(null);
    getArticles(); // refresh data
  };

  // Tambah Artikel
  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/berita`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    });

    const data = await res.json();
    setArticles((prev) => [...prev, data]); // tambahkan ke state
    setShowAddModal(false);
    setNewArticle({
      judul: "",
      penulis: "",
      tanggal: "",
      image: "",
      artikel: "",
    });
  };

  // --- EDIT ARTICLE ---
  const handleEditClick = (article: ArticleData) => {
    // ADDED
    setCurrentEdit(article);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    // ADDED
    e.preventDefault();
    if (!currentEdit) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/berita/${currentEdit.id}`,
      {
        method: "PUT", // ADDED
        headers: { "Content-Type": "application/json" }, // ADDED
        body: JSON.stringify(currentEdit), // ADDED
      }
    );

    const data = await res.json();
    setArticles((prev) => prev.map((a) => (a.id === data.id ? data : a)));
    setShowEditModal(false);
    setCurrentEdit(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        {/* Search */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center bg-white rounded-full shadow px-4 py-2 flex-1">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              className="w-full outline-none"
              placeholder="Cari Artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100">
            <FiFilter className="text-gray-600" size={20} />
          </button>

          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Artikel +
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-600">Memuat artikel...</p>}

        {/* Total Artikel */}
        {!loading && (
          <p className="text-gray-600 mb-6 ml-2">
            Total{" "}
            <span className="font-semibold">{articles.length} artikel</span>
          </p>
        )}

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loading &&
            articles
              .filter((a) =>
                a.judul.toLowerCase().includes(search.toLowerCase())
              )
              .map((article) => (
                <ArticleCard
                  key={article.id}
                  data={article}
                  onDetail={fetchDetail}
                  onDelete={(id) => {
                    setDeleteId(id);
                    setShowDeleteModal(true);
                  }}
                  onEdit={handleEditClick}
                />
              ))}
        </div>
      </main>

      {/* Modal Detail Artikel */}
      {showDetailModal && detailData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full">
            <h2 className="text-xl font-bold mb-3">{detailData.judul}</h2>

            <img
              src={detailData.image}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />

            <p className="text-sm text-gray-500 mb-2">
              Date: {new Date(detailData.tanggal).toLocaleDateString("id-ID")}
            </p>

            <p className="text-gray-700 whitespace-pre-line">
              {detailData.artikel}
            </p>

            <button
              className="mt-5 bg-gray-800 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowDetailModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-3">Hapus Artikel?</h2>
            <p className="text-gray-700 mb-4">
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Artikel */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full">
            <h2 className="text-xl font-bold mb-4">Tambah Artikel</h2>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Judul"
                className="border p-2 rounded-lg"
                value={newArticle.judul}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, judul: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Penulis"
                className="border p-2 rounded-lg"
                value={newArticle.penulis}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, penulis: e.target.value })
                }
                required
              />

              <input
                type="date"
                placeholder="Tanggal"
                className="border p-2 rounded-lg"
                value={newArticle.tanggal}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, tanggal: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="URL Gambar"
                className="border p-2 rounded-lg"
                value={newArticle.image}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, image: e.target.value })
                }
              />

              <textarea
                placeholder="Artikel"
                className="border p-2 rounded-lg"
                value={newArticle.artikel}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, artikel: e.target.value })
                }
                required
              />

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowAddModal(false)}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal &&
        currentEdit && ( // ADDED
          <ModalForm
            title="Edit Artikel" // ADDED
            article={currentEdit} // ADDED
            setArticle={setCurrentEdit} // ADDED
            onClose={() => setShowEditModal(false)} // ADDED
            onSubmit={handleEditSubmit} // ADDED
          />
        )}
    </div>
  );
}

/* Card Artikel */
const ArticleCard = ({
  data,
  onDetail,
  onDelete,
  onEdit,
}: ArticleCardProps) => (
  <div className="bg-white rounded-xl shadow p-3">
    <img
      src={data.image}
      alt="artikel"
      className="w-full h-40 object-cover rounded-lg mb-3"
    />

    <h3 className="font-bold text-lg mb-1">{data.judul}</h3>
    <p className="text-sm text-gray-500 mb-1">
      {new Date(data.tanggal).toLocaleDateString("id-ID")}
    </p>

    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{data.artikel}</p>

    <div className="flex justify-between items-center">
      <button
        className="text-green-600 font-semibold flex items-center gap-1"
        onClick={() => onDetail(data.id)}
      >
        <FiExternalLink /> Detail
      </button>

      <div className="flex gap-3 text-gray-600">
        <FiEdit
          className="cursor-pointer hover:text-blue-500"
          onClick={() => onEdit(data)}
        />
        <FiTrash
          className="cursor-pointer hover:text-red-500"
          onClick={() => onDelete(data.id)}
        />
      </div>
    </div>
  </div>
);

const ModalForm = (
  { title, article, setArticle, onClose, onSubmit }: any // ADDED
) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Judul"
          className="border p-2 rounded-lg"
          value={article.judul}
          onChange={(e) => setArticle({ ...article, judul: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Penulis"
          className="border p-2 rounded-lg"
          value={article.penulis}
          onChange={(e) => setArticle({ ...article, penulis: e.target.value })}
          required
        />
        <input
          type="date"
          className="border p-2 rounded-lg"
          value={article.tanggal.split("T")[0]} // ADDED
          onChange={(e) => setArticle({ ...article, tanggal: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="URL Gambar"
          className="border p-2 rounded-lg"
          value={article.image}
          onChange={(e) => setArticle({ ...article, image: e.target.value })}
        />
        <textarea
          placeholder="Artikel"
          className="border p-2 rounded-lg"
          value={article.artikel}
          onChange={(e) => setArticle({ ...article, artikel: e.target.value })}
          required
        />
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
);
