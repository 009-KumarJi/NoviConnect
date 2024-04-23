import mongoose, {Schema, model, Types} from "mongoose";

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

export const Request = mongoose.models.Request || model("Request", requestSchema);

// Path: server/models/request.model.js