import React from "react";
import NotFoundPage from "../app/components/Error";
import HeaderForIndex from "../app/components/HeaderForIndex";
import Footer from "../app/components/Footer";

export default function NotFound() {
  return (
    <div>
      <HeaderForIndex />
      <NotFoundPage />
      <Footer />
    </div>
  );
}
