module.exports = (sequelize, Sequelize) => {
  const OrderProduct = sequelize.define('order_product', {
    quantity: Sequelize.INTEGER,
    packing: Sequelize.STRING,
  }, { timestamps: false });

  return OrderProduct;
};