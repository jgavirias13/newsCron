const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BreakingNewSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

mongoose.model("BreakingNew", BreakingNewSchema);

module.exports = mongoose.model("BreakingNew");