import {Schema, model, models, Types} from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a sender"],
  },
  chat: {
    type: Types.ObjectId,
    ref: "Chat",
    required: [true, "Please provide a chat"],
  },
  content: {
    type: String,
  },
  attachments: [{
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

export const Message = models.Message || model("Message", messageSchema);