const Sequelize = require("sequelize");
const sequelize = require("../database");

const Forgotpassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
  },
  isactive: {
    type: Sequelize.BOOLEAN,
  }
});

module.exports = Forgotpassword;