import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customers } from "../store/slices/customersSlice";
import { showMessage } from "../store/slices/uiSlice";
import Loader from "../components/Loader";

export default function CustomerFormPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, saving } = useSelector((s) => s.customers);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) dispatch(customers.fetchOne(id));
    else dispatch(customers.clearCurrent());
  }, [id, dispatch]);

  useEffect(() => {
    if (id && current) setForm({ name: current.name, phone: current.phone, address: current.address || "" });
  }, [id, current]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Customer name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number (7-15 digits)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(customers.save({ id, values: form })).unwrap();
      dispatch(showMessage({ type: "success", text: id ? "Customer updated" : "Customer added" }));
      navigate("/customers");
    } catch (msg) {
      dispatch(showMessage({ type: "danger", text: msg }));
    }
  };

  if (id && loading) return <Loader />;

  return (
    <div className="card shadow-sm" style={{ maxWidth: 600 }}>
      <div className="card-body">
        <h4 className="mb-3">{id ? "Edit Customer" : "Add Customer"}</h4>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input className={`form-control ${errors.name ? "is-invalid" : ""}`} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="invalid-feedback">{errors.name}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Phone number *</label>
            <input className={`form-control ${errors.phone ? "is-invalid" : ""}`} value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0300-1234567" />
            <div className="invalid-feedback">{errors.phone}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Address (optional)</label>
            <textarea className="form-control" rows="2" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <button className="btn btn-primary me-2" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/customers")}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
