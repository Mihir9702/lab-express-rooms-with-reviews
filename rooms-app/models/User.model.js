const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: String,
    fullName: String,
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
