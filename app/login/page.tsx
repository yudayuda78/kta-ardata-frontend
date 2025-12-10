"use client";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function login() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Jika sudah login → redirect ke /home
    if (token) {
      router.replace("/home");
    }
  }, []);

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // State untuk form
  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
    alamat: "",
    password: "",
    role: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.role) {
      setError("Harap isi semua field!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      // SIMPAN TOKEN DI LOCAL STORAGE
      document.cookie = `token=${data.token}; path=/;`;
      console.log(data);
      if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    } catch (err: any) {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const isError = (value: string) => !value && error;

  return (
    <div className="min-h-screen bg-linear-to-b from-green-400 to-white flex flex-col items-center justify-center px-6">
      {/* ALERT MERAH DI ATAS */}
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3 text-center">
          Data tidak boleh kosong
        </div>
      )}

      <img src="/logo.svg" alt="Logo" className="w-24 h-24 mb-4" />

      <div className="w-full max-w-xs rounded-xl shadow-lg p-6 bg-linear-to-b from-white to-green-200">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Masuk
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* EMAIL */}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full px-3 py-2 bg-white border rounded-lg placeholder:text-gray-400 text-black 
            focus:outline-none focus:ring-2 
            ${
              isError(form.email)
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-green-400"
            }`}
            placeholder="Email"
          />

          {/* PASSWORD */}
          <div className="relative w-full">
            <input
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-3 py-2 bg-white border rounded-lg placeholder:text-gray-400 text-black pr-10
              focus:outline-none focus:ring-2 
              ${
                isError(form.password)
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-green-400"
              }`}
              placeholder="Password"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* ROLE */}
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className={`w-full px-3 py-2 bg-white border rounded-lg text-black
            focus:outline-none focus:ring-2 
            ${
              isError(form.role)
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-green-400"
            }`}
          >
            <option value="" disabled hidden className="text-gray-400">
              Daftar sebagai
            </option>
            <option value="anggota">Anggota</option>
            <option value="umum">Umum</option>
          </select>

          <div className="mt-2">
            <Button color="green" className="w-full" type="submit">
              Masuk
            </Button>
          </div>
        </form>

        <p className="text-black text-sm text-center mt-3">
          Belum punya akun?
          <Link href="/register" className="text-green-600 font-semibold ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
