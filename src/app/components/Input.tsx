import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
        "placeholder-gray-400",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
