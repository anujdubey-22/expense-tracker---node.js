const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");
const jwt = require('jsonwebtoken');

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
function generateToken(id){
  console.log(id,'id in generateToken')
  var token = jwt.sign({ userId: id }, 'shhhhh fir koi hai');
  return token;
}
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
      //console.log(email,data.email)
      if (match && email === data.email) {
        res.status(201).json({ message: "User Login Successfully", data: data ,token:generateToken(data.id)});
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
    const { amount, description, category,token } = req.body;
    const user = jwt.verify(token, 'shhhhh fir koi hai');
    console.log(user,'user, hihihihhi')
    //console.log(amount,description, category);
    const data = await Expense.create({
      userId : user.userId,
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
    const user = req.user;
    console.log(user,'user');
    const data = await Expense.findAll({where: {userId:user.userId}});
    //console.log(data,'data in finding All in app.js');
    res.status(201).json({ response: data });
  } catch (error) {
    console.log(error, "error in creating in app.js");
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = jwt.verify(token, 'shhhhh fir koi hai');
    console.log(user);
    const response = await Expense.destroy({ where: { userId: user.userId } });
    res.status(201).json({ response });
  } catch (error) {
    console.log(error, "error in deleting expense in app.js");
  }
};
