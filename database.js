require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('newexpense',process.env.db_root,process.env.db_password,{
    host:'localhost',
    dialect:'mysql'
})


module.exports = sequelize;