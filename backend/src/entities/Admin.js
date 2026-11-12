const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Admin",
  tableName: "admins",
  columns: {
    id: { type: "int", primary: true, generated: true },
    name: { type: "varchar", length: 100 },
    email: { type: "varchar", length: 150, unique: true },
    password: { type: "varchar", length: 255 },
  },
});
