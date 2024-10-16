const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const connectionString = process.env.DATABASE_URL;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("MongoDB connection is established");
  })
  .catch((err) => console.error("connection error: " + err));