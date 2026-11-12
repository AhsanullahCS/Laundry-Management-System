const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/data-source");
const HttpError = require("../utils/HttpError");

const repo = () => AppDataSource.getRepository("Admin");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, "Email and password are required");

  const admin = await repo().findOneBy({ email: email.trim().toLowerCase() });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new HttpError(401, "Invalid email or password");
  }
  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
};

exports.me = async (req, res) => {
  const admin = await repo().findOneBy({ id: req.admin.id });
  if (!admin) throw new HttpError(401, "Admin not found");
  res.json({ id: admin.id, name: admin.name, email: admin.email });
};
