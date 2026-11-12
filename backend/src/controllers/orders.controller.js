const { AppDataSource } = require("../config/data-source");
const HttpError = require("../utils/HttpError");
const paginate = require("../utils/paginate");

const STATUSES = ["Pending", "In Progress", "Completed", "Delivered"];
const repo = () => AppDataSource.getRepository("Order");

const baseQuery = () =>
  repo()
    .createQueryBuilder("o")
    .leftJoinAndSelect("o.customer", "c")
    .leftJoinAndSelect("o.service", "s")
    .leftJoinAndSelect("o.payment", "p");

async function findFull(id) {
  const order = await baseQuery().where("o.id = :id", { id: Number(id) }).getOne();
  if (!order) throw new HttpError(404, "Order not found");
  return order;
}

function clean(b) {
  const errors = [];
  const customerId = parseInt(b.customerId);
  const serviceId = parseInt(b.serviceId);
  const quantity = Number(b.quantity);
  const pricePerItem = Number(b.pricePerItem);
  const status = b.status || "Pending";

  if (!customerId) errors.push("Customer is required");
  if (!serviceId) errors.push("Service is required");
  if (!Number.isInteger(quantity) || quantity < 1) errors.push("Quantity must be a whole number of at least 1");
  if (b.pricePerItem === undefined || b.pricePerItem === "" || isNaN(pricePerItem) || pricePerItem < 0) {
    errors.push("Price per item must be 0 or more");
  }
  if (!b.orderDate) errors.push("Order date is required");
  if (!b.expectedDeliveryDate) errors.push("Expected delivery date is required");
  if (b.orderDate && b.expectedDeliveryDate && b.expectedDeliveryDate < b.orderDate) {
    errors.push("Expected delivery date cannot be before the order date");
  }
  if (!STATUSES.includes(status)) errors.push("Invalid order status");
  if (errors.length) throw new HttpError(400, errors.join(", "));

  return {
    customerId, serviceId, quantity, pricePerItem, status,
    orderDate: b.orderDate,
    expectedDeliveryDate: b.expectedDeliveryDate,
    // Total Bill = Quantity x Price Per Item
    totalBill: Math.round(quantity * pricePerItem * 100) / 100,
  };
}

async function loadRefs(v) {
  const customer = await AppDataSource.getRepository("Customer").findOneBy({ id: v.customerId });
  if (!customer) throw new HttpError(404, "Customer not found");
  const service = await AppDataSource.getRepository("Service").findOneBy({ id: v.serviceId });
  if (!service) throw new HttpError(404, "Service not found");
  return { customer, service };
}

exports.list = async (req, res) => {
  const qb = baseQuery();
  if (req.query.search) {
    qb.andWhere("(c.name ILIKE :s OR c.phone ILIKE :s OR CAST(o.id AS TEXT) = :exact)", {
      s: `%${req.query.search}%`,
      exact: req.query.search.replace("#", ""),
    });
  }
  if (req.query.status) qb.andWhere("o.status = :status", { status: req.query.status });
  const sortMap = { date: "o.orderDate", amount: "o.totalBill", delivery: "o.expectedDeliveryDate" };
  res.json(await paginate(qb, req.query, sortMap, "date"));
};

exports.getOne = async (req, res) => res.json(await findFull(req.params.id));

exports.create = async (req, res) => {
  const v = clean(req.body);
  const { customer, service } = await loadRefs(v);

  const orderId = await AppDataSource.transaction(async (m) => {
    const order = await m.save(
      "Order",
      m.create("Order", {
        customer, service,
        quantity: v.quantity, pricePerItem: v.pricePerItem, totalBill: v.totalBill,
        orderDate: v.orderDate, expectedDeliveryDate: v.expectedDeliveryDate, status: v.status,
      })
    );
    // Every new order starts as Unpaid
    await m.save("Payment", m.create("Payment", { order, amount: v.totalBill, method: "Cash", status: "Unpaid" }));
    return order.id;
  });
  res.status(201).json(await findFull(orderId));
};

exports.update = async (req, res) => {
  const order = await findFull(req.params.id);
  const v = clean(req.body);
  const { customer, service } = await loadRefs(v);

  const isPaid = order.payment && order.payment.status === "Paid";
  if (isPaid && v.totalBill !== order.totalBill) {
    throw new HttpError(400, "This order is already paid, so its bill amount cannot be changed");
  }

  await AppDataSource.transaction(async (m) => {
    await m.update("Order", order.id, {
      customer, service,
      quantity: v.quantity, pricePerItem: v.pricePerItem, totalBill: v.totalBill,
      orderDate: v.orderDate, expectedDeliveryDate: v.expectedDeliveryDate, status: v.status,
    });
    if (!isPaid && order.payment) await m.update("Payment", order.payment.id, { amount: v.totalBill });
  });
  res.json(await findFull(order.id));
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) throw new HttpError(400, "Invalid order status");
  const order = await findFull(req.params.id);
  await repo().update(order.id, { status });
  res.json(await findFull(order.id));
};

exports.remove = async (req, res) => {
  const result = await repo().delete(Number(req.params.id)); // its payment is deleted too (CASCADE)
  if (!result.affected) throw new HttpError(404, "Order not found");
  res.json({ message: "Order deleted" });
};
