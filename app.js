const connectDB = require("./db/connect");
require("dotenv").config();
const express = require("express");
const router = require("./routes/products");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const app = express();
require("express-async-errors");
// app.get("/", (req, res) => {
//     res.send('home');
// });

app
  .use([express.urlencoded({ extended: false }), express.json()])
  .get("/", (req, res) => {
    res.send("<h1>Store API</h1>");
  })
  .use("/api/v1/products", router)
  //error handlers
  .use(errorHandler)
  .use(notFound);

//you can define your port value on PC using:
//CLI => set PORT = ####
//now the PORT is set in the computers enviroment

const port = process.env.PORT || 3000;

const startApp = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`listening @ ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
startApp();
