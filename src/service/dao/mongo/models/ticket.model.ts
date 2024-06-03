import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: Number,
  purchaser: String,
});

export const ticketModel = mongoose.model("ticket", ticketSchema);
