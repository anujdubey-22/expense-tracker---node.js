const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Expense = require("./models/expense");
const Router = require('./routes/expense');
const sequelize = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.use("/user",Router);

async function sync() {
  try {
    const data = await sequelize.sync({force :true});
    console.log(data);
    app.listen(3000, () => {
      console.log("server started on Port 3000");
    });
  } catch (error) {
    console.log(error, "error in sync database in app.js");
  }
}

sync();
