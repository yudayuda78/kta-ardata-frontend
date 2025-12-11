"use client";

import Link from "next/link";
import { Home, Users, Newspaper, Briefcase, Store, Wallet } from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
  { name: "Anggota", href: "/dashboard/anggota", icon: <Users size={20} /> },
  {
    name: "Artikel",
    href: "/dashboard/artikel",
    icon: <Newspaper size={20} />,
  },
  {
    name: "Karya dan Bisnis",
    href: "/karya-bisnis",
    icon: <Briefcase size={20} />,
  },
  { name: "Marketplace", href: "/marketplace", icon: <Store size={20} /> },
  {
    name: "Iuran & Donasi",
    href: "/dashboard/iuran",
    icon: <Wallet size={20} />,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white shadow-md p-6 fixed left-0 top-0">
      {/* Logo */}
      <h1 className="font-bold text-xl mb-10 text-black">Admin Panel</h1>

      {/* Navigation Menu */}
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 text-gray-700 p-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition"
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
