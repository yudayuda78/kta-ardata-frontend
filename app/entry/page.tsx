import Button from "@/components/Button";

export default function Entry() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-white flex flex-col items-center justify-center px-6 text-center">
      <img src="/logo.svg" alt="Logo" className="w-24 h-24 mb-6" />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">ORGANISASI ABC</h1>

      <p className="text-gray-700 max-w-md mb-8">
        Aplikasi siap digunakan. Silakan login atau buat akun baru untuk mulai.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button color="green">Login</Button>
        <Button color="gray">Daftar Akun</Button>
      </div>
    </div>
  );
}
