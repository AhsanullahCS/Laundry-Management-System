const { EntitySchema } = require("typeorm");
const decimal = { to: (v) => v, from: (v) => (v === null ? null : parseFloat(v)) };
module.exports = new EntitySchema({
  name: "Payment",
  tableName: "payments",
  columns: {
    id: { type: "int", primary: true, generated: true },
    amount: { type: "decimal", precision: 10, scale: 2, transformer: decimal },
    method: { type: "varchar", length: 20, default: "Cash" },
    status: { type: "varchar", length: 10, default: "Unpaid" },
    paymentDate: { type: "timestamp", nullable: true },
  },
  relations: {
    order: { type: "one-to-one", target: "Order", joinColumn: true, onDelete: "CASCADE", nullable: false, inverseSide: "payment" },
  },
});
