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
    required: [true, "Please provide a password"],
    select: false,
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
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
});

export const User = mongoose.models.User || model("User", userSchema);

// Path: server/models/user.model.js