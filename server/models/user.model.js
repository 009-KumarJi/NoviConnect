import {Schema, model, models} from "mongoose";

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

export const User = models.User || model("User", userSchema);