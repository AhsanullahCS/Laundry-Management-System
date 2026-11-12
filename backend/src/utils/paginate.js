// Adds sorting + pagination to a TypeORM query builder and returns a standard response.
module.exports = async function paginate(qb, query, sortMap, defaultSort) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);
  const sortColumn = sortMap[query.sortBy] || sortMap[defaultSort];
  const order = String(query.order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

  qb.orderBy(sortColumn, order).skip((page - 1) * limit).take(limit);
  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit, totalPages: Math.max(Math.ceil(total / limit), 1) };
};
