import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-full p-10 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-3xl font-bold text-black">Dashboard Admin</h2>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-bold text-black">Super Admin</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>

            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
              A
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
