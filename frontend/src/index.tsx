import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import NavBar from "./components/NavBar";
import AppRoutes from "./routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
