import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) dispatch(login(form));
  };

  return (
    <div className="container">
      <div className="card login-box shadow-sm">
        <div className="card-body p-4">
          <h3 className="text-center mb-1">Laundry Manager</h3>
          <p className="text-center text-muted">Admin login</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <div className="invalid-feedback">{errors.password}</div>
            </div>
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
