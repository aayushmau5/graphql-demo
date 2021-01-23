const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
