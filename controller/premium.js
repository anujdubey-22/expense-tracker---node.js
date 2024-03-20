const Expense = require("../models/expense");
const Order = require("../models/order");
const User = require("../models/user");

exports.getshowLeaderBoard = async (req, res, next) => {
  try {
    console.log("in premium controller");
    const expenses = await Expense.findAll();
    //console.log(expenses, "expenses in premium controller");
    const expensesObj = {};
    for (let item of expenses) {
      //console.log(item.id);
      if (expensesObj[item.userId]) {
        expensesObj[item.userId] =
          expensesObj[item.userId] + item.expenseAmount;
      } else {
        expensesObj[item.userId] = item.expenseAmount;
      }
    }
    //console.log(expensesObj);
    const users = await User.findAll();
    
    const userWithExpenseArr = [];
    for (let user of users) {
        //console.log(user.id,user.name)
        //console.log(expensesObj[user.id]);
        userWithExpenseArr.push( { name:user.name,Total_Expense: expensesObj[user.id]!=undefined ?  expensesObj[user.id] : 0} );
        //console.log(userWithExpenseArr)
    }
    //console.log(userWithExpenseArr);
    userWithExpenseArr.sort((a, b) => b.Total_Expense - a.Total_Expense);
    res.status(201).json({data:userWithExpenseArr});
  } catch (error) {
    console.log(error, "error in getshowLeaderBoard controller");
  }
};
