const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");

const saltRounds = 10;

function isValid(string) {
  if (string == null || string == undefined || string.length == 0) {
    return false;
  } else {
    return true;
  }
}

exports.postUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (isValid(name) && isValid(email) && isValid(password)) {
      console.log("user sign up post request");
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (!err) {
          // Store hash in your password DB.
          const data = await User.create({
            name: name,
            email: email,
            password: hash,
          });
          res.status(201).json("Done");
        } else {
          console.log(err, "error in hashing");
          return res.status(404).send("Error in hashing");
        }
      });
    } else {
      res.status(404).send("Some field must be missing, Fill every Field.");
    }
  } catch (error) {
    console.log(error, "error in creating User in app.js");
    res.status(404).send("Duplicate Email Found");
  }
};

exports.postValidate = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //console.log(email,password);
    const data = await User.findOne({ where: { email: email } });
    if (data === null) {
      return res.status(404).json("email does not exist");
    }
    //console.log(data)
    //console.log(data.email);
    if (data.password == null) {
      return res.status(401).json("password does not match");
    }
    if (data.password != null) {
      const hash = data.password;
      const match = bcrypt.compareSync(password, hash);
      console.log(match);
      if (match && email === data.email) {
        res.status(201).json("User Login Successfully");
      } else {
        res.status(401).json("password does not match");
      }
    }
  } catch (error) {
    console.log(error, "error in validate Post in controller");
  }
};

exports.postExpense = async (req, res, next) => {
  try {
    console.log(req.body);
    const { amount, description, category } = req.body;
    //console.log(amount,description, category);
    const data = await Expense.create({
      expenseAmount: amount,
      description: description,
      category: category,
    });
    //console.log(data,'data after creating expense table in app.js');
    res.status(201).json({ newExpenseDetail: data });
  } catch (err) {
    console.log(err, "error in creating Expense");
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const data = await Expense.findAll();
    //console.log(data,'data in finding All in app.js');
    res.status(201).json({ response: data });
  } catch (error) {
    console.log(error, "error in creating in app.js");
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const response = await Expense.destroy({ where: { id: id } });
    res.status(201).json({ response });
  } catch (error) {
    console.log(error, "error in deleting expense in app.js");
  }
};
