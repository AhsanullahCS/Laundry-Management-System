const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Customer",
  tableName: "customers",
  columns: {
    id: { type: "int", primary: true, generated: true },
    name: { type: "varchar", length: 100 },
    phone: { type: "varchar", length: 20 },
    address: { type: "varchar", length: 255, nullable: true },
    createdAt: { type: "timestamp", createDate: true },
  },
});
