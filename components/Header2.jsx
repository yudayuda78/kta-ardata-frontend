"use client";

import { useRouter } from "next/navigation";

export default function Header2({ title }) {
  const router = useRouter();

  return (
    <div className="bg-green-600 text-white p-4 flex items-center gap-3 rounded-b-2xl">
      <button className="text-white text-2xl" onClick={() => router.back()}>
        &lt;
      </button>

      <h2 className="text-lg font-semibold mx-auto">{title}</h2>
    </div>
  );
}
