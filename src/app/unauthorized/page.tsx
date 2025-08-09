import React from "react";
import NotFoundPage from "../components/Error";
import HeaderForIndex from "../components/HeaderForIndex";
import Footer from "../components/Footer";

const page = () => {
  return (
    <div>
      <HeaderForIndex />
      <NotFoundPage />
      <Footer />
    </div>
  );
};

export default page;
