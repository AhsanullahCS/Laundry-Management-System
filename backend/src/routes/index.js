const router = require("express").Router();
const wrap = require("../middleware/asyncHandler");
const auth = require("../middleware/auth");

const authC = require("../controllers/auth.controller");
const customers = require("../controllers/customers.controller");
const services = require("../controllers/services.controller");
const orders = require("../controllers/orders.controller");
const payments = require("../controllers/payments.controller");
const dashboard = require("../controllers/dashboard.controller");

// Public
router.post("/auth/login", wrap(authC.login));

// Everything below needs a valid admin token
router.use(auth);
router.get("/auth/me", wrap(authC.me));
router.get("/dashboard", wrap(dashboard.stats));

router.get("/customers", wrap(customers.list));
router.post("/customers", wrap(customers.create));
router.get("/customers/:id", wrap(customers.getOne));
router.put("/customers/:id", wrap(customers.update));
router.delete("/customers/:id", wrap(customers.remove));

router.get("/services", wrap(services.list));
router.post("/services", wrap(services.create));
router.get("/services/:id", wrap(services.getOne));
router.put("/services/:id", wrap(services.update));
router.delete("/services/:id", wrap(services.remove));

router.get("/orders", wrap(orders.list));
router.post("/orders", wrap(orders.create));
router.get("/orders/:id", wrap(orders.getOne));
router.put("/orders/:id", wrap(orders.update));
router.patch("/orders/:id/status", wrap(orders.updateStatus));
router.delete("/orders/:id", wrap(orders.remove));

router.get("/payments", wrap(payments.list));
router.patch("/payments/:id/pay", wrap(payments.pay));

module.exports = router;
