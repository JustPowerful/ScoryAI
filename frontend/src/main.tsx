import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import { Toaster } from "react-hot-toast";
import QueryProvider from "./components/providers/QueryProvider";
import Layout from "./components/global/Layout";
import Subjects from "./components/pages/Subjects";
import Subject from "./components/pages/Subject";

import { redirect } from "react-router-dom";
import Account from "./components/pages/Account";

const authLoader = async () => {
  try {
    const response = await fetch("/api/auth/validate", {
      method: "POST",
    });

    if (response.ok) {
      return null;
    } else {
      throw redirect("/");
    }
  } catch (error) {
    throw redirect("/");
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/subjects", element: <Subjects />, loader: authLoader },
      { path: "/subject/:id", element: <Subject />, loader: authLoader },
      { path: "/account", element: <Account />, loader: authLoader },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster />
    </QueryProvider>
  </StrictMode>
);
