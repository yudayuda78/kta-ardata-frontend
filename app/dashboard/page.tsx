"use client";

import {
  Users,
  Newspaper,
  Package,
  Coins,
  User,
  FileText,
  Box,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  useEffect(() => {
    const token = getCookie("token");

    if (!token) {
      console.log("kosong");
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const user = await res.json();

        setUserRole(user.role);

        // Jika bukan admin → di-redirect
        if (user.role !== "admin") {
          router.push("/home");
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div className="space-y-8">
      {/* Header */}

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Anggota"
          value="1.500"
          icon={<Users size={32} />}
          color="blue"
        />
        <StatCard
          title="Artikel"
          value="100"
          icon={<Newspaper size={32} />}
          color="green"
        />
        <StatCard
          title="Produk"
          value="100"
          icon={<Package size={32} />}
          color="purple"
        />
        <StatCard
          title="Iuran"
          value="150.000"
          icon={<Coins size={32} />}
          color="red"
        />
      </div>

      {/* Section Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Anggota">
          <ListItem
            name="Jane Doe"
            desc="Mendaftar sebagai anggota baru"
            icon={<User />}
          />
          <ListItem
            name="John Doe"
            desc="Mendaftar sebagai anggota baru"
            icon={<User />}
          />
        </SectionCard>

        <SectionCard title="Artikel">
          <ListItem
            name="Jane Doe"
            desc="Mengunggah artikel"
            icon={<FileText />}
          />
          <ListItem
            name="John Doe"
            desc="Mengunggah artikel"
            icon={<FileText />}
          />
        </SectionCard>

        <SectionCard title="Produk">
          <ListItem
            name="Jane Doe"
            desc="Menambah produk baru"
            icon={<Box />}
          />
          <ListItem
            name="John Doe"
            desc="Menambah produk baru"
            icon={<Box />}
          />
        </SectionCard>

        <SectionCard title="Transaksi Iuran">
          <ListItem
            name="Pembayaran Iuran"
            desc="Rp.100.000"
            icon={<Wallet />}
          />
          <ListItem name="Donasi" desc="Rp.100.000" icon={<Wallet />} />
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;

  color: "blue" | "green" | "purple" | "red";
}) {
  const bgColors = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    purple: "from-purple-500 to-purple-700",
    red: "from-red-500 to-red-700",
  };

  return (
    <div
      className={`p-6 rounded-xl text-white bg-gradient-to-br ${bgColors[color]} shadow-lg`}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium">{title}</p>
        <div>{icon}</div>
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ListItem({
  name,
  desc,
  icon,
}: {
  name: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
