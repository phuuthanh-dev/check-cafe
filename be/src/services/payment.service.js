"use strict";

const paymentModel = require("../models/payment.model");
const { getInfoData, getSelectData } = require("../utils");
const { BadRequestError, NotFoundError } = require("../configs/error.response");
const { getPaginatedData } = require("../helpers/mongooseHelper");

class PaymentService {
    async getMyPayment(req) {
        const {
            page = 1,
            limit = 10,
            search
        } = req.query;

        const { userId } = req.user;

        const query = {
            user_id: userId,
        };
        const paginateOptions = {
            model: paymentModel,
            query,
            page,
            limit,
            select: getSelectData([
                "_id",
                "orderCode",
                "amount",
                "status",
            ]),
            populate: [
                { path: "package_id", select: "_id name description duration" }
            ],
            search,
            searchFields: ["orderCode"],
        };
        const result = await getPaginatedData(paginateOptions);
        return result;
    }

    async getShopPayments(req) {
        const {
            page = 1,
            limit = 10,
            search
        } = req.query;

        const { shop_id } = req.user;

        if (!shop_id) {
            throw new BadRequestError("Shop ID is required");
        }

        const query = {
            shop_id: shop_id,
            payment_type: "shop_package"
        };
        const paginateOptions = {
            model: paymentModel,
            query,
            page,
            limit,
            select: getSelectData([
                "_id",
                "orderCode",
                "amount",
                "status",
                "created_at",
                "updated_at"
            ]),
            populate: [
                { path: "package_id", select: "_id name description duration price target_type" }
            ],
            search,
            searchFields: ["orderCode"],
            sort: { created_at: -1 }
        };
        const result = await getPaginatedData(paginateOptions);
        return result;
    }

    async getAllShopPayments(req) {
        const {
            page = 1,
            limit = 10,
            search
        } = req.query;

        const query = {
            payment_type: "shop_package"
        };
        const paginateOptions = {
            model: paymentModel,
            query,
            page,
            limit,
            select: getSelectData([
                "_id",
                "orderCode",
                "amount",
                "status",
                "created_at",
                "updated_at"
            ]),
            populate: [
                { path: "package_id", select: "_id name description duration price target_type" },
                { path: "shop_id", select: "_id name address phone owner_id", populate: { path: "owner_id", select: "_id full_name email" } }
            ],
            search,
            searchFields: ["orderCode"],
            sort: { created_at: -1 }
        };
        const result = await getPaginatedData(paginateOptions);
        return result;
    }
    async getPaymentStatus(req) {
        const { paymentId } = req.params;
        if (!paymentId) {
            throw new BadRequestError("Payment ID is required");
        }

        const payment = await paymentModel.findById(paymentId);
        if (!payment) {
            throw new NotFoundError("Payment not found");
        }

        return payment;
    }

}

module.exports = new PaymentService();
