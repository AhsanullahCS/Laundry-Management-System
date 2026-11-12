const { EntitySchema } = require("typeorm");
const decimal = { to: (v) => v, from: (v) => (v === null ? null : parseFloat(v)) };
module.exports = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: { type: "int", primary: true, generated: true },
    quantity: { type: "int" },
    pricePerItem: { type: "decimal", precision: 10, scale: 2, transformer: decimal },
    totalBill: { type: "decimal", precision: 10, scale: 2, transformer: decimal },
    orderDate: { type: "date" },
    expectedDeliveryDate: { type: "date" },
    status: { type: "varchar", length: 20, default: "Pending" },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    customer: { type: "many-to-one", target: "Customer", joinColumn: true, onDelete: "CASCADE", nullable: false },
    service: { type: "many-to-one", target: "Service", joinColumn: true, onDelete: "RESTRICT", nullable: false },
    payment: { type: "one-to-one", target: "Payment", inverseSide: "order" },
  },
});
