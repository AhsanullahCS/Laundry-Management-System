import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../store/slices/dashboardSlice";
import Loader from "../components/Loader";
import { money } from "../utils/helpers";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((s) => s.dashboard);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (loading && !stats) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return null;

  const cards = [
    { label: "Total Customers", value: stats.totalCustomers, color: "primary" },
    { label: "Total Orders", value: stats.totalOrders, color: "primary" },
    { label: "Pending Orders", value: stats.pendingOrders, color: "warning" },
    { label: "In Progress", value: stats.inProgressOrders, color: "info" },
    { label: "Completed Orders", value: stats.completedOrders, color: "success" },
    { label: "Delivered Orders", value: stats.deliveredOrders, color: "secondary" },
    { label: "Paid Bills", value: stats.paidBills, color: "success" },
    { label: "Unpaid Bills", value: stats.unpaidBills, color: "danger" },
    { label: "Total Revenue", value: money(stats.totalRevenue), color: "success" },
  ];

  return (
    <>
      <h3 className="mb-3">Dashboard</h3>
      <div className="row g-3">
        {cards.map((c) => (
          <div className="col-12 col-sm-6 col-lg-4" key={c.label}>
            <div className={`card stat-card border-${c.color}`}>
              <div className="card-body">
                <div className="text-muted small">{c.label}</div>
                <div className={`fs-3 fw-bold text-${c.color}`}>{c.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
