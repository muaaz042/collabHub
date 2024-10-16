const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

require("./Connection/Connection.js");


app.listen(port, () => {
  console.log(`App is running on ${port}`);
});