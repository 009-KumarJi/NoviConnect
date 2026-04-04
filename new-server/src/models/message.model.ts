import mongoose, {model, Schema, Types} from "mongoose";

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
  encryptedContent: {
    version: {
      type: Number,
      default: 1,
    },
    algorithm: {
      type: String,
      default: "AES-GCM",
    },
    ciphertext: {
      type: String,
    },
    iv: {
      type: String,
    },
    encryptedKeys: [{
      userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
    }],
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
    originalName: {
      type: String,
      default: "",
    },
    mimeType: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 0,
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    encryptedFile: {
      version: {
        type: Number,
        default: 1,
      },
      algorithm: {
        type: String,
        default: "AES-GCM",
      },
      iv: {
        type: String,
        default: "",
      },
      encryptedKeys: [{
        userId: {
          type: Types.ObjectId,
          ref: "User",
        },
        key: {
          type: String,
        },
      }],
    },
  }],
}, {
  timestamps: true,
});

export const Message = mongoose.model("Message", messageSchema);

// Path: server/models/message.model.js
