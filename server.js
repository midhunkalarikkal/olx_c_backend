const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const productRouter = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());

function mongooseConnection() {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL);
  mongoose.connection.on("error", (err) => {
    console.log("mongodb connection error : ", err);
  });
  mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
  });
}

mongooseConnection();

app.use('/user',productRouter);

const PORT = process.env._SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is runnig on port", PORT);
});
