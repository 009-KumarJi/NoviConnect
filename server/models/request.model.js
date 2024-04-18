import {Schema, model, models, Types} from "mongoose";

const requestSchema = new Schema({
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "rejected"],
  },
  sender: {
    type: Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a sender"],
  },
  receiver: {
    type: Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a receiver"],
  }
}, {
  timestamps: true,
});

export const Request = models.Request || model("Request", requestSchema);