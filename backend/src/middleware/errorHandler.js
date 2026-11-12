exports.notFound = (req, res) => res.status(404).json({ message: "Route not found" });

exports.errorHandler = (err, req, res, next) => {
  if (!err.status) console.error(err);
  // 23505 = unique violation in PostgreSQL
  if (err.code === "23505") return res.status(400).json({ message: "This value already exists" });
  res.status(err.status || 500).json({ message: err.status ? err.message : "Internal server error" });
};
