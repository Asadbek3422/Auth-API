const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: [6, "Parol 6 ta belgidan ko'p bo'lishi shart"],
      required: true,
    },
    token: { type: String },
  },
  {
    versionKey: false,
  }
);

module.exports = model("user", userSchema);
