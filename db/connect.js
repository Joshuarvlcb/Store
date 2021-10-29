const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = (url) => {
  return mongoose.connect(url);
};
connectDB(process.env.MONGO_URL);

module.exports = connectDB;
