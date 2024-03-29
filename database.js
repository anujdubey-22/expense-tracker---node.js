require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('newexpense',process.env.db_root,process.env.db_password,{
    host:process.env.db_host ,
    dialect:process.env.db_dialect
})


module.exports = sequelize;