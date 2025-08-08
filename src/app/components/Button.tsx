import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "small" | "admin"; // Added size prop
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "default", 
  ...props
}) => {
  
  const sizeStyles = {
    small: "w-[110px] px-3 py-3 rounded text-sm font-medium",
    default: "w-[400px] px-6 py-2 rounded-md text-sm font-medium",
    admin: "w-[140px] px-3 py-2 rounded-md text-sm font-medium", 
  };

  const variantStyles = {
    primary: "bg-[#4F46E5] text-white hover:bg-[#4338ca]",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };
  
  // Base styles that are common to all buttons
  const commonBaseStyle = "focus:outline-none focus:ring-2 focus:ring-offset-2 transition";

  const combinedClassName = `
    ${sizeStyles[size]} 
    ${variantStyles[variant]} 
    ${commonBaseStyle}
    ${className}
  `;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;