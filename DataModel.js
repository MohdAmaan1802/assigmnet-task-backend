const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema({
  data: { type: String, required: true },
});

module.exports = mongoose.model("data", DataSchema);
// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const dataSchema = new Schema({
//   data: { type: String, required: true },
//   addCount: { type: Number, default: 0 },
//   updateCount: { type: Number, default: 0 },
// });

// module.exports = mongoose.model("data", dataSchema);
