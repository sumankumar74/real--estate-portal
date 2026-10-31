
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import PropertyDetails from "../pages/PropertyDetails";
import ToastProvider from "../components/ToastProvider";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AddProperty from "./admin/AddProperty";
import AdminProperties from "./admin/AdminProperties";
import AdminUsers from "./admin/AdminUsers";


function AdminRoute() {
  const token =
    localStorage.getItem("estatehubToken") ||
    sessionStorage.getItem("estatehubToken");

  const userData =
    localStorage.getItem("estatehubUser") ||
    sessionStorage.getItem("estatehubUser");

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}

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

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <ToastProvider />
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/properties" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
