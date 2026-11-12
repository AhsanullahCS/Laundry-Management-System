const { AppDataSource } = require("../config/data-source");
const HttpError = require("../utils/HttpError");
const paginate = require("../utils/paginate");

const repo = () => AppDataSource.getRepository("Service");

function clean(body) {
  const errors = [];
  const name = (body.name || "").trim();
  const price = Number(body.price);
  if (!name) errors.push("Service name is required");
  if (body.price === undefined || body.price === "" || isNaN(price) || price <= 0) {
    errors.push("Price must be greater than 0");
  }
  if (errors.length) throw new HttpError(400, errors.join(", "));
  return { name, price };
}

async function findOr404(id) {
  const service = await repo().findOneBy({ id: Number(id) });
  if (!service) throw new HttpError(404, "Service not found");
  return service;
}

exports.list = async (req, res) => {
  const qb = repo().createQueryBuilder("s");
  if (req.query.search) qb.where("s.name ILIKE :s", { s: `%${req.query.search}%` });
  res.json(await paginate(qb, req.query, { name: "s.name", amount: "s.price", date: "s.id" }, "name"));
};

exports.getOne = async (req, res) => res.json(await findOr404(req.params.id));

exports.create = async (req, res) => {
  const values = clean(req.body);
  if (await repo().findOneBy({ name: values.name })) throw new HttpError(400, "A service with this name already exists");
  res.status(201).json(await repo().save(repo().create(values)));
};

exports.update = async (req, res) => {
  const service = await findOr404(req.params.id);
  const values = clean(req.body);
  const duplicate = await repo().findOneBy({ name: values.name });
  if (duplicate && duplicate.id !== service.id) throw new HttpError(400, "A service with this name already exists");
  Object.assign(service, values);
  res.json(await repo().save(service));
};

exports.remove = async (req, res) => {
  const service = await findOr404(req.params.id);
  const used = await AppDataSource.getRepository("Order").count({ where: { service: { id: service.id } } });
  if (used > 0) throw new HttpError(400, "This service is used by existing orders and cannot be deleted");
  await repo().delete(service.id);
  res.json({ message: "Service deleted" });
};
