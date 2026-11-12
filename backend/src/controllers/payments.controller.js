const { AppDataSource } = require("../config/data-source");
const HttpError = require("../utils/HttpError");
const paginate = require("../utils/paginate");

const repo = () => AppDataSource.getRepository("Payment");

const baseQuery = () =>
  repo()
    .createQueryBuilder("p")
    .leftJoinAndSelect("p.order", "o")
    .leftJoinAndSelect("o.customer", "c")
    .leftJoinAndSelect("o.service", "s");

exports.list = async (req, res) => {
  const qb = baseQuery();
  if (req.query.status) qb.andWhere("p.status = :status", { status: req.query.status });
  if (req.query.search) {
    qb.andWhere("(c.name ILIKE :s OR c.phone ILIKE :s OR CAST(o.id AS TEXT) = :exact)", {
      s: `%${req.query.search}%`,
      exact: req.query.search.replace("#", ""),
    });
  }
  const sortMap = { date: "o.orderDate", amount: "p.amount", paid: "p.paymentDate" };
  res.json(await paginate(qb, req.query, sortMap, "date"));
};

// Record a cash payment and mark the bill as Paid
exports.pay = async (req, res) => {
  const payment = await repo().findOneBy({ id: Number(req.params.id) });
  if (!payment) throw new HttpError(404, "Payment record not found");
  if (payment.status === "Paid") throw new HttpError(400, "This bill is already paid");

  const hasAmount = req.body.amount !== undefined && req.body.amount !== "";
  const amount = hasAmount ? Number(req.body.amount) : payment.amount;
  if (isNaN(amount) || Math.abs(amount - payment.amount) > 0.001) {
    throw new HttpError(400, `Cash received must equal the bill amount (Rs. ${payment.amount})`);
  }

  payment.amount = amount;
  payment.method = "Cash";
  payment.status = "Paid";
  payment.paymentDate = new Date();
  await repo().save(payment);

  const full = await baseQuery().where("p.id = :id", { id: payment.id }).getOne();
  res.json(full);
};
