/******* Dependencies */
require("express-async-errors");

const express = require("express");
const app = express();

/****** Internal Dependencies */
const connectDB = require("./database/connectDB");
const { PORT, MONGO_URI } = require("./config");
const authenticateUser = require("./middlewares/auth");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const errorHandler = require("./middlewares/error-handler");

/****** Built-in Middleware */
app.use(express.json());

app.use("/api/v1/user", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productsRouter);

/****** Custom Middlewares */
app.use(errorHandler);

/******* Connect DB */
const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
