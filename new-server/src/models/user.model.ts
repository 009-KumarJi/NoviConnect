import mongoose, {model, Schema} from "mongoose";
import {hash} from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  dob: {
    type: Date,
    required: [true, "Please provide a date of birth"],
  },
  bio: {
    type: String,
    default: "Hey there! I am using NoviConnect.",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  encryptionPublicKey: {
    type: String,
    default: "",
  },
  encryptedPrivateKeyBundle: {
    type: String,
    default: "",
  },
  encryptionBundleIv: {
    type: String,
    default: "",
  },
  encryptionBundleSalt: {
    type: String,
    default: "",
  },
  encryptionBundleIterations: {
    type: Number,
    default: 0,
  },
  encryptionKeyVersion: {
    type: Number,
    default: 1,
  },
  encryptedRecoveryKeyBundle: {
    type: String,
    default: "",
  },
  recoveryBundleIv: {
    type: String,
    default: "",
  },
  recoveryBundleSalt: {
    type: String,
    default: "",
  },
  hasRecoveryKey: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await hash(this.password, 10);
});

export const User = mongoose.model("User", userSchema);

// Path: server/models/user.model.js
