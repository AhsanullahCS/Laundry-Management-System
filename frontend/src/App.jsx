import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import FlashMessage from "./components/FlashMessage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerFormPage from "./pages/CustomerFormPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceFormPage from "./pages/ServiceFormPage";
import OrdersPage from "./pages/OrdersPage";
import OrderFormPage from "./pages/OrderFormPage";
import PaymentsPage from "./pages/PaymentsPage";

export default function App() {
  const token = useSelector((s) => s.auth.token);
  return (
    <>
      <FlashMessage />
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/new" element={<ServiceFormPage />} />
            <Route path="/services/:id/edit" element={<ServiceFormPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/new" element={<OrderFormPage />} />
            <Route path="/orders/:id/edit" element={<OrderFormPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
