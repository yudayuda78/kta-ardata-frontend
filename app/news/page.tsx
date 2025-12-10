"use client";

import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Home,
  BookOpen,
  FileText,
  Printer,
  Settings,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Header2 from "@/components/Header2";

type NewsItem = {
  id: number;
  judul: string;
  penulis: string;
  image: string | null;
  tanggal: string;
  artikel: string;
};

export default function news() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [news, setNews] = useState<NewsItem[]>([]);

  const categories = ["Semua", "Umum", "Trending"];
  const [loading, setLoading] = useState(true);

  // GET DATA API LARAVEL
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/berita");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <Header2 title="Berita" />

      <div className="px-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white shadow p-3 rounded-full grow">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berita"
              className="ml-2 outline-none w-full text-sm"
            />
          </div>

          <button className="bg-white shadow p-3 rounded-full">
            <SlidersHorizontal size={22} className="text-green-700" />
          </button>
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="flex gap-3 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full border ${
                selectedCategory === cat
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-600 border-green-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* NEWS LIST (2 columns) */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-4">
        {news.map((item) => (
          <div key={item.id} className="w-full">
            <img
              src={
                item.image
                  ? `http://127.0.0.1:8000/storage/${item.image}`
                  : "/no-image.png"
              }
              className="rounded-xl w-full h-32 object-cover"
              alt={item.judul}
            />

            <h2 className="font-semibold text-sm mt-2 leading-tight">
              {item.judul}
            </h2>

            <span className="text-red-600 text-xs">Baca Selengkapnya</span>
          </div>
        ))}
      </div>
      {/* Bottom Navigation */}
      <Navigation></Navigation>
    </div>
  );
}
