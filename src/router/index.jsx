import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";

import AppLayout from "../layouts/AppLayout";

import HomePage from "../pages/home";
import FindFitPage from "../pages/findFit";
import MensFitPage from "../pages/findFit/MensFitpage";
import WomensFitPage from "../pages/findFit/WomensFitPage";
import CartPage from "../pages/cart";
import DescriptionPage from "../pages/description";
import PaymentPage from "../pages/payment";
import SearchPage from "../pages/search";
import Products from "../pages/sex/product";

export const router = createBrowserRouter([
  {
    id: "app",
    element: <AppLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <HomePage />,
      },
      {
        path: PATHS.FIND_FIT,
        element: <FindFitPage />,
      },
      {
        path: PATHS.MENS_FIT,
        element: <MensFitPage />,
      },
      {
        path: PATHS.WOMENS_FIT,
        element: <WomensFitPage />,
      },
      {
        path: PATHS.CART,
        element: <CartPage />,
      },
      {
        path: PATHS.DESCRIPTION,
        element: <DescriptionPage />,
      },
      {
        path: PATHS.PAYMENT,
        element: <PaymentPage />,
      },
      {
        path: PATHS.SEARCH,
        element: <SearchPage />,
      },
      {
        path: PATHS.MEN,
        element: <Products />,
      },
      {
        path: PATHS.WOMEN,
        element: <Products />,
      },
      {
        path: PATHS.KIDS,
        element: <Products />,
      },
    ],
  },
]);
