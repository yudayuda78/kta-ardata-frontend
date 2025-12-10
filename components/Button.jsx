"use client";

const COLORS = {
  blue: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",
  red: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
  green: "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white",
  yellow: "bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-black",
  black: "bg-black hover:bg-gray-900 active:bg-gray-800 text-white",
  white: "bg-white border border-gray-300 hover:bg-gray-100 text-gray-900",
  gray: "bg-gray-400 hover:bg-gray-500 active:bg-gray-600 text-white",
};

export default function Button({
  children,
  onClick = () => {},
  type = "button",
  color = "blue",
  className = "",
}) {
  const colorClass = COLORS[color] || COLORS.blue;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        ${colorClass}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
