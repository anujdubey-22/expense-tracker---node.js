const bcrypt = require("bcrypt");
const Expense = require("../models/expense");

const saltRounds = 10;

function isValid(string) {
  if (string == null || string == undefined || string.length == 0) {
    return false;
  } else {
    return true;
  }
}

exports.userPost = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (isValid(name) && isValid(email) && isValid(password)) {
      console.log("user sign up post request");
      bcrypt.hash(
        password,
        saltRounds,
        async function (err, hash) {
          if (!err) {
            // Store hash in your password DB.
            const data = await Expense.create({
              name: name,
              email: email,
              password: hash,
            });
            res.status(201).json("Done");
          } else {
            console.log(err, "error in hashing");
            return res.status(404).send("Error in hashing");
          }
        }
      );
    } else {
      res.status(404).send("Some field must be missing, Fill every Field.");
    }
  } catch (error) {
    console.log(error, "error in creating Expense in app.js");
    res.status(404).send("Duplicate Email Found");
  }
};

exports.validatePost = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //console.log(email,password);
    const data = await Expense.findOne({ where: { email: email } });
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
      if(match && email === data.email){
        res.status(201).json("User Login Successfully");
      }
      else{
        res.status(401).json("password doent match")
      }
    }
  } catch (error) {
    console.log(error, "error in validate Post in controller");
  }
};
