const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const Users = require("./users");

const wallpostsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    sender: { type: ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallposts", wallpostsSchema);
