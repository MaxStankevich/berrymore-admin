const { Op } = require("sequelize");
const db = require("../models");
const Product = db.product;

exports.products = (req, res) => {
  Product.findAll({ where: { deleted: { [Op.not]: true } } }).then(products => {
    res.status(200).send(products);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
};

exports.product = (req, res) => {
  Product.findByPk(req.params.id).then(product => {
    res.status(200).send(product);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.updateProduct = (req, res) => {
  Product.findByPk(req.params.id).then(product => {
    product.update(req.body).then(product => {
      res.status(200).send(product);
    });
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.createProduct = (req, res) => {
  Product.create(req.body).then(product => {
    res.status(201).send(product);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.deleteProduct = (req, res) => {
  Product.findByPk(req.params.id)
    .then(product => {
      return product.update({ deleted: true })
    }).then(() => {
    res.status(204).end();
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};
