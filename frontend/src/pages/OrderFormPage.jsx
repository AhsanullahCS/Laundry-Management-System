import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { orders } from "../store/slices/ordersSlice";
import { customers } from "../store/slices/customersSlice";
import { services } from "../store/slices/servicesSlice";
import { showMessage } from "../store/slices/uiSlice";
import Loader from "../components/Loader";
import { ORDER_STATUSES, money, today } from "../utils/helpers";

const emptyForm = () => ({
  customerId: "", serviceId: "", quantity: 1, pricePerItem: "",
  orderDate: today(), expectedDeliveryDate: "", status: "Pending",
});

export default function OrderFormPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, saving } = useSelector((s) => s.orders);
  const customerList = useSelector((s) => s.customers.items);
  const serviceList = useSelector((s) => s.services.items);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});

  // Load dropdown data (and the order itself when editing)
  useEffect(() => {
    dispatch(customers.fetchList({ limit: 100, sortBy: "name", order: "ASC" }));
    dispatch(services.fetchList({ limit: 100, sortBy: "name", order: "ASC" }));
    if (id) dispatch(orders.fetchOne(id));
    else dispatch(orders.clearCurrent());
  }, [id, dispatch]);

  useEffect(() => {
    if (id && current) {
      setForm({
        customerId: current.customer.id,
        serviceId: current.service.id,
        quantity: current.quantity,
        pricePerItem: current.pricePerItem,
        orderDate: current.orderDate,
        expectedDeliveryDate: current.expectedDeliveryDate,
        status: current.status,
      });
    }
  }, [id, current]);

  const total = Number(form.quantity || 0) * Number(form.pricePerItem || 0); // Total = Quantity x Price
  const isPaid = id && current?.payment?.status === "Paid";

  // choosing a service fills in its default price (admin can still change it)
  const handleServiceChange = (serviceId) => {
    const svc = serviceList.find((s) => String(s.id) === serviceId);
    setForm({ ...form, serviceId, pricePerItem: svc ? svc.price : form.pricePerItem });
  };

  const validate = () => {
    const e = {};
    if (!form.customerId) e.customerId = "Select a customer";
    if (!form.serviceId) e.serviceId = "Select a service";
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) e.quantity = "Quantity must be at least 1";
    if (form.pricePerItem === "" || Number(form.pricePerItem) < 0) e.pricePerItem = "Enter a valid price";
    if (!form.orderDate) e.orderDate = "Order date is required";
    if (!form.expectedDeliveryDate) e.expectedDeliveryDate = "Expected delivery date is required";
    else if (form.expectedDeliveryDate < form.orderDate) e.expectedDeliveryDate = "Cannot be before the order date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(orders.save({ id, values: form })).unwrap();
      dispatch(showMessage({ type: "success", text: id ? "Order updated" : "Order created (Unpaid)" }));
      navigate("/orders");
    } catch (msg) {
      dispatch(showMessage({ type: "danger", text: msg }));
    }
  };

  const field = (name) => `form-control ${errors[name] ? "is-invalid" : ""}`;
  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  if (id && loading) return <Loader />;

  return (
    <div className="card shadow-sm" style={{ maxWidth: 800 }}>
      <div className="card-body">
        <h4 className="mb-3">{id ? `Edit Order #${id}` : "Create Order"}</h4>
        {isPaid && <div className="alert alert-info">This order is already paid, so the bill amount cannot be changed.</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Customer *</label>
              <select className={`form-select ${errors.customerId ? "is-invalid" : ""}`} value={form.customerId} onChange={set("customerId")}>
                <option value="">Select customer</option>
                {customerList.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
              </select>
              <div className="invalid-feedback">{errors.customerId}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Laundry service *</label>
              <select className={`form-select ${errors.serviceId ? "is-invalid" : ""}`} value={form.serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}>
                <option value="">Select service</option>
                {serviceList.map((s) => <option key={s.id} value={s.id}>{s.name} ({money(s.price)})</option>)}
              </select>
              <div className="invalid-feedback">{errors.serviceId}</div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Quantity *</label>
              <input type="number" min="1" className={field("quantity")} value={form.quantity} onChange={set("quantity")} />
              <div className="invalid-feedback">{errors.quantity}</div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Price per item (Rs.) *</label>
              <input type="number" min="0" step="0.01" className={field("pricePerItem")} value={form.pricePerItem} onChange={set("pricePerItem")} />
              <div className="invalid-feedback">{errors.pricePerItem}</div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Total bill</label>
              <input className="form-control fw-bold" value={money(total)} readOnly />
            </div>
            <div className="col-md-4">
              <label className="form-label">Order date *</label>
              <input type="date" className={field("orderDate")} value={form.orderDate} onChange={set("orderDate")} />
              <div className="invalid-feedback">{errors.orderDate}</div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Expected delivery date *</label>
              <input type="date" className={field("expectedDeliveryDate")} value={form.expectedDeliveryDate}
                min={form.orderDate} onChange={set("expectedDeliveryDate")} />
              <div className="invalid-feedback">{errors.expectedDeliveryDate}</div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Order status</label>
              <select className="form-select" value={form.status} onChange={set("status")}>
                {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button className="btn btn-primary me-2" disabled={saving}>{saving ? "Saving..." : "Save Order"}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/orders")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
