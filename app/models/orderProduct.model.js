module.exports = (sequelize, Sequelize) => {
  const OrderProduct = sequelize.define('order_product', {
    quantity: Sequelize.DECIMAL,
    packing: Sequelize.STRING,
  }, { timestamps: false });

  return OrderProduct;
};