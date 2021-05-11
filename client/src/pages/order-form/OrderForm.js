import React, { useState } from 'react';
import {
  Form,
  Button,
  notification, Input
} from 'antd';
import request from "../../utils/request";
import Products from "../admin/components/orders/form/components/products/Products";
import OrderFields from "../admin/components/orders/form/components/order-fields/OrderFields";
import CustomerFields from "../admin/components/orders/form/components/customer-fields/CustomerFields";
import { Link } from "react-router-dom";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 10,
    },
  },
};

const OrderForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onFinish = (values) => {
    const errors = [];

    if (!values.products || !values.products.length) {
      errors.push("Не выбраны товары")
    } else if (values.products.some(product => !product.quantity)) {
      errors.push("Не указано количество товара")
    }

    console.log(values.products);

    if (errors.length) {
      notification.error({ message: errors.join(". ") })
    } else {
      setLoading(true);

      request.post("/orders", values)
        .then(
          () => {
            notification.success({
              message: "Заказ отправлен"
            })
            setSuccess(true);
          },
          () => {
            notification.error({ message: "Не удалось отправить заказ" });
          }
        ).finally(() => {
        setLoading(false);
      })
    }
  };

  return success ?
    <div style={{ maxWidth: 750, margin: "50px auto 30px auto", padding: "20px" }}>
      <h1>Ваш заказ отправлен!</h1>
      <h3>Мы свяжемся с вами как только сможем. Спасибо что выбрали нас!</h3>
      <a href="http://berrymore.by">
        <Button size="large">Вернуться на сайт</Button>
      </a>
    </div> :
    <div className="order-form">
      <div style={{ maxWidth: 750, margin: "50px auto 30px auto" }}>
        <h3>Пожалуйста, выберите интересующие вас ягоды, укажите кол-во ящиков объёмами (1, 2 или 5 кг), заполните все
          поля помеченные <span style={{ color: "red" }}>*</span> и
          нажмите кнопку <b>Отправить</b>. Позже мы свяжемся с вами по указанным контактам.</h3>
      </div>
      <Form
        layout="vertical"
        form={form}
        name="order"
        onFinish={onFinish}
        initialValues={{
          deliveryMethodId: 1,
          orderStatusId: 1,
          paymentMethod: "Наличные",
          products: [{ id: null, quantity: 1 }]
        }}
        scrollToFirstError
        style={{ maxWidth: 750, margin: "0 auto", paddingBottom: 30 }}
      >
        <Products form={form}/>
        <OrderFields form={form}/>
        <CustomerFields validatePhone/>
        <Form.Item
          name="notes"
          label="Дополнительные условия и пожелания"
        >
          <Input.TextArea/>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={loading}>
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </div>
};

export default OrderForm;