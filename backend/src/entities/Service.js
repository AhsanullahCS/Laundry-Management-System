const { EntitySchema } = require("typeorm");
// PostgreSQL returns DECIMAL as a string, so we convert it to a number.
const decimal = { to: (v) => v, from: (v) => (v === null ? null : parseFloat(v)) };
module.exports = new EntitySchema({
  name: "Service",
  tableName: "services",
  columns: {
    id: { type: "int", primary: true, generated: true },
    name: { type: "varchar", length: 100, unique: true },
    price: { type: "decimal", precision: 10, scale: 2, transformer: decimal },
  },
});
