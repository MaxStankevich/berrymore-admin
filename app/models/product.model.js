module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    unit: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.INTEGER
    },
    deleted: {
      type: Sequelize.BOOLEAN
    }
  }, { timestamps: false });

  return Product;
};