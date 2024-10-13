import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  color?: "green" | "red" | "blue" | "gray"; // You can extend this list as needed
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({
  children,
  color = "blue", // Default color is blue
  type = "button",
  onClick,
  className = "",
}: ButtonProps) => {
  const baseClass =
    "text-white font-medium transition duration-300 ease-in-out rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none focus:ring-2";

  // Dynamically build the color classes based on the `color` prop
  const colorClasses = {
    green: `bg-green-700 hover:bg-green-800 focus:ring-green-300`,
    red: `bg-red-700 hover:bg-red-800 focus:ring-red-300`,
    blue: `bg-blue-700 hover:bg-blue-800 focus:ring-blue-300`,
    gray: `bg-gray-700 hover:bg-gray-800 focus:ring-gray-300`,
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseClass} ${colorClasses[color]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
