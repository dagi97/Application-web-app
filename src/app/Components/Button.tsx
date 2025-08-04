import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseStyle =
    "w-[400px] px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition";

  const variantStyles = {
    primary: "bg-[#4F46E5] text-white hover:bg-[#4338ca]",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };

  const combinedClassName = `${baseStyle} ${variantStyles[variant]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
