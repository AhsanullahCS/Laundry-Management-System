export const errMsg = (e) =>
  e.response?.data?.message || (e.code === "ERR_NETWORK" ? "Cannot reach the server. Is the backend running?" : e.message) || "Something went wrong";

export const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "-");

export const ORDER_STATUSES = ["Pending", "In Progress", "Completed", "Delivered"];

export const statusColor = {
  Pending: "warning",
  "In Progress": "info",
  Completed: "success",
  Delivered: "secondary",
  Paid: "success",
  Unpaid: "danger",
};
