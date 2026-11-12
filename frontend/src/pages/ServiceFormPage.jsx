import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { services } from "../store/slices/servicesSlice";
import { showMessage } from "../store/slices/uiSlice";
import Loader from "../components/Loader";

export default function ServiceFormPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, saving } = useSelector((s) => s.services);
  const [form, setForm] = useState({ name: "", price: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) dispatch(services.fetchOne(id));
    else dispatch(services.clearCurrent());
  }, [id, dispatch]);

  useEffect(() => {
    if (id && current) setForm({ name: current.name, price: current.price });
  }, [id, current]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Service name is required";
    if (form.price === "" || Number(form.price) <= 0) e.price = "Price must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(services.save({ id, values: form })).unwrap();
      dispatch(showMessage({ type: "success", text: id ? "Service updated" : "Service added" }));
      navigate("/services");
    } catch (msg) {
      dispatch(showMessage({ type: "danger", text: msg }));
    }
  };

  if (id && loading) return <Loader />;

  return (
    <div className="card shadow-sm" style={{ maxWidth: 600 }}>
      <div className="card-body">
        <h4 className="mb-3">{id ? "Edit Service" : "Add Service"}</h4>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Service name *</label>
            <input className={`form-control ${errors.name ? "is-invalid" : ""}`} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dry Cleaning" />
            <div className="invalid-feedback">{errors.name}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Price per item (Rs.) *</label>
            <input type="number" min="0" step="0.01" className={`form-control ${errors.price ? "is-invalid" : ""}`}
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <div className="invalid-feedback">{errors.price}</div>
          </div>
          <button className="btn btn-primary me-2" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/services")}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
