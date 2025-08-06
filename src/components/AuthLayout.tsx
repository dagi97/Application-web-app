import React, { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" max-w-[448px] mx-auto flex flex-col justify-center items-center min-h-screen">
      {children}
    </div>
  );
}
