const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const sequelize = require("../database");

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
function generateToken(id, isPremium,expenseId) {
  console.log(id, "id in generateToken");
  var token = jwt.sign({ userId: id, isPremium, expenseId:expenseId }, "shhhhh fir koi hai");
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
        res.status(201).json({
          message: "User Login Successfully",
          data: data,
          token: generateToken(data.id, data.isPremium),
        });
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
    await sequelize.transaction(async () => {
      console.log(req.body);
      const { amount, description, category, token } = req.body;
      const user = jwt.verify(token, "shhhhh fir koi hai");
      console.log(user, "user, hihihihhi");
      //console.log(amount,description, category);
      const data = await Expense.create(
        {
          userId: user.userId,
          expenseAmount: amount,
          description: description,
          category: category,
        }
      );
      console.log(data,'data after creating expense table in app.js');
      // Update the total amount in the User record
      const userFound = await User.findByPk(user.userId);
      userFound.totalAmount += parseInt(amount);
      await userFound.save();
      
      newToken = generateToken(user.userId,userFound.isPremium,data.dataValues.id);
      console.log(data.dataValues.id,'iddddddddddddddddd',newToken,'newtokennnnnnnnnnnnnnn')
      
      res.status(201).json({ newExpenseDetail: data,token:newToken });
    })
  } catch (err) {
    console.log(err, "error in creating Expense");
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user, "user");
    const data = await Expense.findAll({ where: { userId: user.userId } });
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

exports.postPremium = async (req, res, next) => {
  try {
    const user = req.user;
    var rzp = new Razorpay({
      key_id: "rzp_test_2nRLHGamGL8Jjk",
      key_secret: "HQp1EwLeRDZ5ik6LV5fYg28G",
    });

    rzp.orders.create(
      {
        amount: 5000,
        currency: "INR",
      },
      (error, order) => {
        if (error) {
          console.log(error, "error in postpremium");
          throw new Error(JSON.stringify(error));
        }
        console.log(order, "order in postPremium in controller.js");
        Order.create({
          userId: req.user.userId,
          orderId: order.id,
          status: "PENDING",
        })
          // req.user
          //   .createOrder({ orderId: order.id, })
          .then(() => {
            return res.status(201).json({ order, key_id: rzp.key_id });
          })
          .catch((error) => {
            throw new Error(err);
          });
      }
    );
  } catch (error) {
    console.log(error, "error in postPremium in controller");
  }
};

exports.postUpdatetransactions = async (req, res, next) => {
  try {
    console.log(req.user, "req.user in postUpdatetransaction in controller.js");
    const { order_id, payment_id } = req.body;
    console.log(
      order_id,
      payment_id,
      "order and paymentId in postUpdatetransactions in controller.js"
    );
    const order = await Order.findOne({ where: { orderId: order_id } });
    console.log(order, "order in postUpdatetransaction");
    const orderUpdate = await order.update({ paymentId: payment_id });
    const response = await User.update(
      { isPremium: true },
      {
        where: {
          id: req.user.userId,
        },
      }
    );
    const user = await User.findOne({ where: { id: req.user.userId } });
    //console.log(user.id,user.isPremium,'user id and isPremium in postUpdatetransactions in Controllerline 183');
    const token = generateToken(user.id, user.isPremium);
    //const response = req.user.update({ isPremium: true });

    // Concurrently await all promises using Promise.all
    await Promise.all([orderUpdate, response]);

    return res
      .status(201)
      .json({
        success: true,
        message: "Transaction successfull",
        token: token,
      });
  } catch (error) {
    console.log(error, "error in post updatetransaction in controller.js");
  }
};

exports.postFailedTransaction = async (req, res, next) => {
  try {
    const { order_id, payment_id } = req.body;
    console.log(
      order_id,
      payment_id,
      "orderId and paymentid in failedTransaction in controller"
    );
    await Order.update(
      { status: "Failed", paymentId: payment_id },
      {
        where: {
          userId: req.user.userId,
          orderId: order_id,
        },
      }
    );
    res.status(400).json({ message: "Failed transaction" });
  } catch (error) {
    console.log(error, "error in poastFailedTransaction in controller");
  }
};
