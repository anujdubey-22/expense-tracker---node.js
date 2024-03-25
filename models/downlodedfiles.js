const Sequelize = require("sequelize");
const sequelize = require("../database");

const Downloadedfiles = sequelize.define("downloadedfiles", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  datedownloaded: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Downloadedfiles;