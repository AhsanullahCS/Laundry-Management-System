const { AppDataSource } = require("../config/data-source");
const HttpError = require("../utils/HttpError");
const paginate = require("../utils/paginate");

const repo = () => AppDataSource.getRepository("Customer");
const PHONE = /^[0-9+\-\s]{7,15}$/;

function clean(body) {
  const errors = [];
  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const address = (body.address || "").trim() || null;
  if (!name) errors.push("Customer name is required");
  if (!phone) errors.push("Phone number is required");
  else if (!PHONE.test(phone)) errors.push("Enter a valid phone number (7-15 digits)");
  if (errors.length) throw new HttpError(400, errors.join(", "));
  return { name, phone, address };
}

async function findOr404(id) {
  const customer = await repo().findOneBy({ id: Number(id) });
  if (!customer) throw new HttpError(404, "Customer not found");
  return customer;
}

exports.list = async (req, res) => {
  const qb = repo().createQueryBuilder("c");
  if (req.query.search) {
    qb.where("(c.name ILIKE :s OR c.phone ILIKE :s)", { s: `%${req.query.search}%` });
  }
  res.json(await paginate(qb, req.query, { name: "c.name", date: "c.createdAt" }, "date"));
};

exports.getOne = async (req, res) => res.json(await findOr404(req.params.id));

exports.create = async (req, res) => {
  const customer = await repo().save(repo().create(clean(req.body)));
  res.status(201).json(customer);
};

exports.update = async (req, res) => {
  const customer = await findOr404(req.params.id);
  Object.assign(customer, clean(req.body));
  res.json(await repo().save(customer));
};

exports.remove = async (req, res) => {
  await findOr404(req.params.id);
  await repo().delete(Number(req.params.id)); // the customer's orders and payments are deleted too (CASCADE)
  res.json({ message: "Customer deleted" });
};
