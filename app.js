/******* Dependencies */
require("dotenv").config();
const express = require("express");
const app = express();

/****** Built-in Middleware */
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

// port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
