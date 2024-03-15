const Sequelize = require('sequelize');
const sequelize = require('../database');

const Expense = sequelize.define('expense',{
    name: {
        type:Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Expense;