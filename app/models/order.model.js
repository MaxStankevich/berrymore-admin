module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    deliveryAddress: {
      type: Sequelize.STRING
    },
    deliveryDate: {
      type: Sequelize.DATE
    },
    deliveryTime: {
      type: Sequelize.STRING
    },
    paymentMethod: {
      type: Sequelize.STRING
    },
    totalAmount: {
      type: Sequelize.DECIMAL
    },
    notes: {
      type: Sequelize.STRING
    },
    deleted: {
      type: Sequelize.BOOLEAN
    }
  });

  return Order;
};