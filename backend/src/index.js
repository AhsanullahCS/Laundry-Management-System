require("reflect-metadata");
require("dotenv").config();
const app = require("./app");
const { AppDataSource } = require("./config/data-source");
const seed = require("./seed");

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(async () => {
    console.log("PostgreSQL connected");
    await seed();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });
