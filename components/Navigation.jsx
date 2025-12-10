export default function Navigation() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md py-3 px-6 flex justify-between">
      <div className="text-gray-600 flex flex-col items-center">
        <span className="text-2xl">🏠</span>
      </div>
      <div className="text-gray-600 flex flex-col items-center">
        <span className="text-2xl">📖</span>
      </div>
      <div className="text-gray-600 flex flex-col items-center">
        <span className="text-2xl">📄</span>
      </div>
      <div className="text-gray-600 flex flex-col items-center">
        <span className="text-2xl">🖨️</span>
      </div>
      <div className="text-gray-600 flex flex-col items-center">
        <span className="text-2xl">⚙️</span>
      </div>
    </div>
  );
}
