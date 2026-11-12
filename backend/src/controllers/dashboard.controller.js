const { AppDataSource } = require("../config/data-source");

exports.stats = async (req, res) => {
  const customers = AppDataSource.getRepository("Customer");
  const orders = AppDataSource.getRepository("Order");
  const payments = AppDataSource.getRepository("Payment");

  const [totalCustomers, totalOrders, pending, inProgress, completed, delivered, paidBills, unpaidBills, revenue] =
    await Promise.all([
      customers.count(),
      orders.count(),
      orders.count({ where: { status: "Pending" } }),
      orders.count({ where: { status: "In Progress" } }),
      orders.count({ where: { status: "Completed" } }),
      orders.count({ where: { status: "Delivered" } }),
      payments.count({ where: { status: "Paid" } }),
      payments.count({ where: { status: "Unpaid" } }),
      payments
        .createQueryBuilder("p")
        .select("COALESCE(SUM(p.amount), 0)", "sum")
        .where("p.status = :s", { s: "Paid" })
        .getRawOne(),
    ]);

  res.json({
    totalCustomers,
    totalOrders,
    pendingOrders: pending,
    inProgressOrders: inProgress,
    completedOrders: completed,
    deliveredOrders: delivered,
    paidBills,
    unpaidBills,
    totalRevenue: Number(revenue.sum),
  });
};
