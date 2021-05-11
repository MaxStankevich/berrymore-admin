module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customers", {
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    deleted: {
      type: Sequelize.BOOLEAN
    }
  });

  return Customer;
};