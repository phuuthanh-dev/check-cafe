"use strict";
const mongoose = require("mongoose");
const { model, Schema, Types } = mongoose;

const DOCUMENT_NAME = "Payment";
const COLLECTION_NAME = "Payments";

const paymentSchema = new Schema({
  orderCode: { type: String },
  user_id: { type: Types.ObjectId, ref: "User" },
  shop_id: { type: Types.ObjectId, ref: "Shop", required: false },
  package_id: { type: Types.ObjectId, ref: "Package" },
  amount: { type: Number },
  status: { type: String },
  payment_type: { 
    type: String, 
    enum: ['user_package', 'shop_package'], 
    default: 'user_package' 
  },
  webhookData: { type: Object },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: COLLECTION_NAME, timestamps: true });

module.exports = model(DOCUMENT_NAME, paymentSchema);
