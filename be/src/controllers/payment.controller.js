"use strict";

const { OK } = require("../configs/success.response");
const { PACKAGE_MESSAGE } = require("../constants/message");
const asyncHandler = require("../helpers/asyncHandler");
const paymentService = require("../services/payment.service.js");

class PaymentController {
  getMyPayment = asyncHandler(async (req, res) => {
    const result = await paymentService.getMyPayment(req);
    new OK({
      message: PACKAGE_MESSAGE.GET_MY_PAYMENT_SUCCESS,
      data: result,
    }).send(res);
  });

  getShopPayments = asyncHandler(async (req, res) => {
    const result = await paymentService.getShopPayments(req);
    new OK({
      message: "Get shop payments successfully",
      data: result,
    }).send(res);
  });

  getAllShopPayments = asyncHandler(async (req, res) => {
    const result = await paymentService.getAllShopPayments(req);
    new OK({
      message: "Get all shop payments successfully",
      data: result,
    }).send(res);
  });

  getPaymentStatus = asyncHandler(async (req, res) => {
    const result = await paymentService.getPaymentStatus(req);
    new OK({
      message: PACKAGE_MESSAGE.GET_PAYMENT_STATUS_SUCCESS,
      data: result,
    }).send(res);
  });
}

module.exports = new PaymentController();

