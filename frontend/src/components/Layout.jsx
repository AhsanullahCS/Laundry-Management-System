import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/customers", label: "Customers" },
  { to: "/services", label: "Services" },
  { to: "/orders", label: "Orders" },
  { to: "/payments", label: "Payments" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((s) => s.auth.admin);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container">
          <span className="navbar-brand fw-bold">Laundry Manager</span>
          <button className="navbar-toggler" type="button" onClick={() => setOpen(!open)}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
            <ul className="navbar-nav me-auto">
              {links.map((l) => (
                <li className="nav-item" key={l.to}>
                  <NavLink to={l.to} end={l.end} className="nav-link" onClick={() => setOpen(false)}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <span className="navbar-text me-3">{admin?.name}</span>
            <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}
