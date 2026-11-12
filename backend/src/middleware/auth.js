const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, "Please log in to continue"));
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new HttpError(401, "Session expired. Please log in again"));
  }
};
