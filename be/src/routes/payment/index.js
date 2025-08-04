"use strict";

const express = require("express");
const { checkAuth, checkRole } = require("../../auth/checkAuth");
const router = express.Router();
const paymentController = require("../../controllers/payment.controller.js");


router.use(checkAuth);

router.get("/me", paymentController.getMyPayment);
router.get("/shop", paymentController.getShopPayments);
router.get("/all-shop", checkRole(["ADMIN"]), paymentController.getAllShopPayments);
router.get("/:paymentId/status", paymentController.getPaymentStatus);


module.exports = router;
