export default function Navigation() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md py-3 px-6 flex justify-between">
      <div className="text-gray-600 flex flex-col items-center">
        <img src="navigation/home.svg" alt="" />
      </div>
      <div className="text-gray-600 flex flex-col items-center">
        <img src="navigation/page.svg" alt="" />
      </div>
      <div className="text-gray-600 flex flex-col items-center">
        <img src="navigation/app.svg" alt="" />
      </div>
      <div className="text-gray-600 flex flex-col items-center">
        <img src="navigation/market.svg" alt="" />
      </div>
      <div className="text-gray-600 flex flex-col items-center">
        <img src="navigation/user.svg" alt="" />
      </div>
    </div>
  );
}
