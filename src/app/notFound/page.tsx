import React from "react";
import NotFoundPage from "../components/Error";
import HeaderForIndex from "../components/HeaderForIndex";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div>
      <HeaderForIndex />
      <NotFoundPage />
      <Footer />
    </div>
  );
}
