
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import PropertyDetails from "../pages/PropertyDetails";
import ToastProvider from "../components/ToastProvider";
import Register from "../pages/Register";
import Login from "../pages/Login";


function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="text-5xl font-bold text-emerald-900">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-stone-900">
        Page Not Found
      </h2>
      <p className="mt-3 text-stone-600">
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="mt-6 rounded-lg bg-emerald-900 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
      >
        Back to Home
      </a>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
    <ToastProvider/>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/properties" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
