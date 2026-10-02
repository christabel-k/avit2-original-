import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { getCartCount } from "../utils/cartUtils";
import Footer from "../components/footer/Footer"

const AppLayout = () => {
  const [cartCount, setCartCount] = useState(() => getCartCount());

  useEffect(() => {
    function updateCartCount() {
      setCartCount(getCartCount());
    }

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;
