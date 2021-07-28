const express = require('express')
const path = require('path')
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcryptjs");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:3000"
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const DeliveryMethod = db.deliveryMethod;
const OrderStatus = db.orderStatus;
const User = db.user;
const Product = db.product;

// { force: true }
db.sequelize.sync().then(() => {
  console.log('Drop and Resync Db');
  console.log("DB_HOST", process.env.DB_HOST);
  console.log("PORT", process.env.PORT);
});

// simple route
app.get("/test", (req, res) => {
  console.log("test");
  res.json({ message: "Welcome to berrymore application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/order.routes')(app);
require('./app/routes/customer.routes')(app);
require('./app/routes/orderStatus.routes')(app);
require('./app/routes/product.routes')(app);

const PORT = process.env.PORT || 5000

app
  .use(express.static(path.join(__dirname, 'client', 'build')))
  .get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

app.listen(PORT, () => console.log(`Listening on ${PORT}`))

function initial() {
  Role.create({
    id: 1,
    name: "admin"
  }).then((role) => {
    console.log(">> Created role: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating role: ", err);
    });

  Role.create({
    id: 2,
    name: "manager"
  }).then((role) => {
    console.log(">> Created role: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating role: ", err);
    });

  DeliveryMethod.create({
    id: 1,
    name: "Самовывоз"
  }).then((role) => {
    console.log(">> Created DeliveryMethod: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating DeliveryMethod: ", err);
    });

  DeliveryMethod.create({
    id: 2,
    name: "Курьер"
  }).then((role) => {
    console.log(">> Created DeliveryMethod: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating DeliveryMethod: ", err);
    });

  OrderStatus.create({
    id: 1,
    name: "Не обработан"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });

  OrderStatus.create({
    id: 2,
    name: "Принят"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });

  OrderStatus.create({
    id: 3,
    name: "Расфасован"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });

  OrderStatus.create({
    id: 4,
    name: "Доставлен"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });
}