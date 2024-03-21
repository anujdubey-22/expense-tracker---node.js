const sequelize = require("../database");
const Expense = require("../models/expense");
const Order = require("../models/order");
const User = require("../models/user");

exports.getshowLeaderBoard = async (req, res, next) => {
  try {
    console.log("in premium controller");
    const users = await User.findAll({
      attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenseAmount')) , 'expenseAmount']],
      include:[
        {
          model:Expense,
          attributes:[]
        }
      ],
      group:['user.id'],
      order:[['expenseAmount','DESC']]
    });
    
    res.status(201).json({data:users});
  } catch (error) {
    console.log(error, "error in getshowLeaderBoard controller");
  }
};
