import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import { Toaster } from "react-hot-toast";
import QueryProvider from "./components/providers/QueryProvider";
import Layout from "./components/global/Layout";
import Subjects from "./components/pages/Subjects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/subjects", element: <Subjects /> },
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
