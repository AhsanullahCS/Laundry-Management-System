require("reflect-metadata");
require("dotenv").config();
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "laundry_db",
  synchronize: true, // creates/updates tables automatically (fine for a university project)
  logging: false,
  entities: [
    require("../entities/Admin"),
    require("../entities/Customer"),
    require("../entities/Service"),
    require("../entities/Order"),
    require("../entities/Payment"),
  ],
});

module.exports = { AppDataSource };
