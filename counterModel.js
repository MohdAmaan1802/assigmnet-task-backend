const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  totalAdds: {
    type: Number,
    default: 0,
  },
  totalUpdates: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
