import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { orders, updateOrderStatus } from "../store/slices/ordersSlice";
import { showMessage } from "../store/slices/uiSlice";
import useListQuery from "../hooks/useListQuery";
import PageHeader from "../components/PageHeader";
import ListToolbar from "../components/ListToolbar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { ORDER_STATUSES, formatDate, money, statusColor } from "../utils/helpers";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { items, total, page, totalPages, loading, error } = useSelector((s) => s.orders);
  const { query, update, setPage, reload } = useListQuery(orders.fetchList);

  const handleDelete = async (o) => {
    if (!window.confirm(`Delete order #${o.id}? Its payment record will also be deleted.`)) return;
    try {
      await dispatch(orders.remove(o.id)).unwrap();
      dispatch(showMessage({ type: "success", text: "Order deleted" }));
      reload();
    } catch (msg) {
      dispatch(showMessage({ type: "danger", text: msg }));
    }
  };

  const handleStatus = async (o, status) => {
    try {
      await dispatch(updateOrderStatus({ id: o.id, status })).unwrap();
      dispatch(showMessage({ type: "success", text: `Order #${o.id} marked ${status}` }));
      reload();
    } catch (msg) {
      dispatch(showMessage({ type: "danger", text: msg }));
    }
  };

  return (
    <>
      <PageHeader title="Orders" actionLabel="+ New Order" actionTo="/orders/new" />
      <ListToolbar
        query={query}
        update={update}
        placeholder="Search by customer, phone or order #..."
        statusOptions={ORDER_STATUSES}
        sortOptions={[
          { value: "date", label: "order date" },
          { value: "amount", label: "amount" },
          { value: "delivery", label: "delivery date" },
        ]}
      />
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-wrap">
        {loading ? <Loader /> : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th><th>Customer</th><th>Service</th><th>Qty</th><th>Total</th>
                  <th>Order date</th><th>Delivery</th><th>Status</th><th>Payment</th><th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && <tr><td colSpan="10" className="text-center text-muted py-4">No orders found</td></tr>}
                {items.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer?.name}<div className="small text-muted">{o.customer?.phone}</div></td>
                    <td>{o.service?.name}</td>
                    <td>{o.quantity}</td>
                    <td>{money(o.totalBill)}</td>
                    <td>{formatDate(o.orderDate)}</td>
                    <td>{formatDate(o.expectedDeliveryDate)}</td>
                    <td>
                      <select className={`form-select form-select-sm border-${statusColor[o.status]}`} value={o.status}
                        onChange={(e) => handleStatus(o, e.target.value)} style={{ minWidth: 120 }}>
                        {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td><span className={`badge text-bg-${statusColor[o.payment?.status]}`}>{o.payment?.status}</span></td>
                    <td className="text-end text-nowrap">
                      <Link to={`/orders/${o.id}/edit`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(o)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
      </div>
    </>
  );
}
