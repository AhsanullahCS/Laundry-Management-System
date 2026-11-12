const bcrypt = require("bcryptjs");
const { AppDataSource } = require("./config/data-source");

// Creates the first admin and some default services (only if they don't exist yet)
module.exports = async function seed() {
  const admins = AppDataSource.getRepository("Admin");
  if ((await admins.count()) === 0) {
    await admins.save(
      admins.create({
        name: process.env.ADMIN_NAME || "Shop Admin",
        email: (process.env.ADMIN_EMAIL || "admin@laundry.com").toLowerCase(),
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10),
      })
    );
    console.log("Default admin created");
  }

  const services = AppDataSource.getRepository("Service");
  if ((await services.count()) === 0) {
    await services.save([
      { name: "Washing", price: 50 },
      { name: "Ironing", price: 30 },
      { name: "Dry Cleaning", price: 200 },
      { name: "Washing and Ironing", price: 70 },
    ]);
    console.log("Default services created");
  }
};
