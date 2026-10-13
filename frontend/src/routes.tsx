import { Routes, Route } from "react-router-dom";
import App from "./App";
import ContactUs from "./ContactUs";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
}
