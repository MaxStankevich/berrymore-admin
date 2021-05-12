module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    deleted: {
      type: Sequelize.BOOLEAN
    }
  }, { timestamps: false });

  return Product;
};