const { Op } = require("sequelize");
const db = require("../models");
const pagination = require("../utils/pagination");
const Order = db.order;
const Customer = db.customer;
const Product = db.product;
const OrderProduct = db.orderProduct;
const OrderStatus = db.orderStatus;
const OrderStatusHistory = db.orderStatusHistory;

exports.orders = (req, res) => {
  const { page, size, filter, order, createdAt } = req.query;
  const { limit, offset } = pagination.getPagination(page, size);

  Order.findAndCountAll({
    distinct: true,
    limit,
    offset,
    where: {
      deleted: { [Op.not]: true },
      ...JSON.parse(filter || "{}"),
      ...(createdAt ? {
        createdAt: {
          [Op.between]: JSON.parse(createdAt)
        }
      } : {})
    },
    include: ["orderStatus", "deliveryMethod", "customer", "user", "products"],
    order: JSON.parse(order || "[]"),
  }).then(orders => {
    res.status(200).send(pagination.getPagingData(orders, page, limit));
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
};

exports.order = (req, res) => {
  Order.findByPk(req.params.id, {
    include: ["orderStatus", "deliveryMethod", "customer", "user", "products", "orderStatusHistories"],
  }).then(order => {
    res.status(200).send(order);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.updateOrder = async (req, res) => {
  try {
    const { products, ...body } = req.body;
    let order = await Order.findByPk(req.params.id, {
      include: "products",
    });
    let oldStatusId;
    if (order) {
      oldStatusId = order.orderStatusId;
      await order.update(body);
      if (order && products && products.length) {
        for (let i = 0; i < products.length; i++) {
          const { id, _destroy, ...orderProduct } = products[i];
          const product = await Product.findByPk(id);
          const existingProduct = await OrderProduct.findOne({
            where: { orderId: req.params.id, productId: id }
          });
          if (_destroy) {
            await order.removeProduct(product)
          } else if (existingProduct) {
            await existingProduct.update(orderProduct)
          } else {
            await order.addProduct(product, { through: orderProduct })
          }
        }
      }
      if (oldStatusId !== body.orderStatusId) {
        console.info("orderStatusId", oldStatusId, order.orderStatusId);
        const status = await OrderStatus.findByPk(body.orderStatusId);
        console.info("status", status);
        if (status && status.name) {
          OrderStatusHistory.create({ orderId: order.id, statusName: status.name })
        }
      }
      res.status(200).send(order);
    } else {
      throw new Error("Не удалось найти заказ");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    let order;
    let customerId = req.body.customerId;
    const { customer: bodyCustomer, products, ...body } = req.body;
    if (!customerId && bodyCustomer && bodyCustomer.phoneNumber) {
      let [customer] = await Customer.findOrCreate({
        where: { phoneNumber: bodyCustomer.phoneNumber },
        defaults: bodyCustomer
      });
      if (customer) {
        customerId = customer.id;
      } else {
        throw new Error("Не удалось сохранить заказчика");
      }
    }
    if (customerId) {
      order = await Order.create({ deleted: false, orderStatusId: 1, customerId, ...body });
      if (order && products && products.length) {
        for (let i = 0; i < products.length; i++) {
          const { id, ...orderProduct } = products[i];
          const product = await Product.findByPk(id);
          if (product) {
            await order.addProduct(product, { through: orderProduct })
          }
        }
        if (order.orderStatusId) {
          console.info("orderStatusId", order.orderStatusId);
          const status = await OrderStatus.findByPk(body.orderStatusId);
          console.info("status", status);
          if (status && status.name) {
            console.info({ orderId: order.id, statusName: status.name });
            OrderStatusHistory.create({ orderId: order.id, statusName: status.name })
          }
        }
        res.status(201).send(order);
      } else {
        throw new Error("Не удалось сохранить заказ");
      }
    } else {
      throw new Error("Не удалось сохранить заказчика");
    }
  } catch (err) {
    res.status(500).send({ message: err.toString() });
  }
};

exports.deleteOrder = (req, res) => {
  Order.findByPk(req.params.id)
    .then(order => {
      return order.update({ deleted: true })
    }).then(() => {
    res.status(204).end();
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};
