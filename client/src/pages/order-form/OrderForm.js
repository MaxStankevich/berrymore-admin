import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  notification, Input
} from 'antd';
import request from "../../utils/request";
import Products from "../admin/components/orders/form/components/products/Products";
import OrderFields from "../admin/components/orders/form/components/order-fields/OrderFields";
import CustomerFields from "../admin/components/orders/form/components/customer-fields/CustomerFields";

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
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    setProductsLoading(true);
    request.get("/products").then(res => {
      setProducts(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить продукты" })
    }).finally(() => {
      setProductsLoading(false);
    })
  }, [setProducts, setProductsLoading])

  const onFinish = (values) => {
    const errors = [];

    if (!values.products || !values.products.length) {
      errors.push("Не выбраны товары")
    } else if (values.products.some(product => !product.quantity)) {
      errors.push("Не указано количество товара")
    }

    const totalQuantity = values.products.reduce((result, val = {}) => {
      return result + (val.quantity || 0);
    }, 0)

    if (totalQuantity < 10 && values.deliveryMethodId === 3) {
      errors.push("Яндекс доставка доступна только при заказе от 10 кг")
    }

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
        <h3>Пожалуйста, выберите интересующие вас ягоды, укажите кол-во ящиков объёмами 1, 2 или 5 кг для голубики и 0.5 кг для малины, заполните все
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
        <Products form={form} products={products} productsLoading={productsLoading} />
        <OrderFields form={form}/>
        <CustomerFields validatePhone/>
        <Form.Item
          name="notes"
          label="Дополнительные условия и пожелания"
        >
          <Input.TextArea/>
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => {
            const productsValue = form.getFieldValue("products") || [];
            const totalPrice = productsValue.reduce((result, val = {}) => {
              const product = products.find((pr => pr.id === val.id)) || {};
              return result + ((val.quantity * product.price) || 0);
            }, 0)
            return `Итого к оплате: ${totalPrice} BYN`;
          }}
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