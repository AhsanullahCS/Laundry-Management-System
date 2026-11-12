import { useDispatch, useSelector } from "react-redux";
import { fetchPayments, recordPayment } from "../store/slices/paymentsSlice";
import { showMessage } from "../store/slices/uiSlice";
import useListQuery from "../hooks/useListQuery";
import PageHeader from "../components/PageHeader";
import ListToolbar from "../components/ListToolbar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { formatDate, money, statusColor } from "../utils/helpers";

export default function PaymentsPage() {
  const dispatch = useDispatch();
  const { items, total, page, totalPages, loading, saving, error } = useSelector((s) => s.payments);
  const { query, update, setPage, reload } = useListQuery(fetchPayments, { status: "Unpaid" });

  const handlePay = async (p) => {
    if (!window.confirm(`Record cash payment of ${money(p.amount)} for order #${p.order.id}?`)) return;
    try {
      await dispatch(recordPayment({ id: p.id, amount: p.amount })).unwrap();
      dispatch(showMessage({ type: "success", text: `Order #${p.order.id} marked as Paid` }));
      reload();
    } catch (msg) {
      dispatch(showMessage({ type: "danger", text: msg }));
    }
  };

  return (
    <>
      <PageHeader title="Payments" />
      <ul className="nav nav-pills mb-3">
        {[["Unpaid", "Unpaid Bills"], ["Paid", "Payment History"], ["", "All"]].map(([value, label]) => (
          <li className="nav-item" key={label}>
            <button className={`nav-link ${query.status === value ? "active" : ""}`}
              onClick={() => update({ status: value, sortBy: value === "Paid" ? "paid" : "date" })}>
              {label}
            </button>
          </li>
        ))}
      </ul>
      <ListToolbar
        query={query}
        update={update}
        placeholder="Search by customer, phone or order #..."
        sortOptions={[
          { value: "date", label: "order date" },
          { value: "amount", label: "amount" },
          { value: "paid", label: "payment date" },
        ]}
      />
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-wrap">
        {loading ? <Loader /> : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order #</th><th>Customer</th><th>Service</th><th>Amount</th>
                  <th>Method</th><th>Status</th><th>Payment date</th><th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && <tr><td colSpan="8" className="text-center text-muted py-4">No payments found</td></tr>}
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.order.id}</td>
                    <td>{p.order.customer?.name}<div className="small text-muted">{p.order.customer?.phone}</div></td>
                    <td>{p.order.service?.name} x {p.order.quantity}</td>
                    <td>{money(p.amount)}</td>
                    <td>{p.method}</td>
                    <td><span className={`badge text-bg-${statusColor[p.status]}`}>{p.status}</span></td>
                    <td>{formatDate(p.paymentDate)}</td>
                    <td className="text-end">
                      {p.status === "Unpaid" && (
                        <button className="btn btn-sm btn-success" disabled={saving} onClick={() => handlePay(p)}>
                          Record Cash Payment
                        </button>
                      )}
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
