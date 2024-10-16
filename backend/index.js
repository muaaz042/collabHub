const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

require("./Connection/Connection.js");
const { sendOTP } = require('./smtp/mail')


app.use("/user", require("./Routes/UserRoutes.js"));
app.use("/workspace", require("./Routes/WorkSpaceRoutes.js"));
app.use("/task", require("./Routes/TaskRoutes.js"));
app.use("/timer", require("./Routes/TimerRoutes.js"));


app.post("/sendOTP", (req, res) => {
  sendOTP(req.body.email)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error("Failed to send OTP:", error); // Log the error
      res.status(500).send("Error sending OTP"); // Send a 500 status with a descriptive message
    });
});


app.listen(port, () => {
  console.log(`App is running on ${port}`);
});