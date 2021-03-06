import React from 'react';
import moment from 'moment';
import {
  Form,
  Input,
  Select,
  DatePicker, Radio,
} from 'antd';
import DeliveryMethod from "./components/DeliveryMethod";

const OrderFields = ({ form }) => {
  return (
    <>
      <Form.Item
        noStyle
        shouldUpdate
      >
        {() => {
          return (
            <DeliveryMethod
              form={form}
            />
          )
        }}
      </Form.Item>
      <Form.Item dependencies={["deliveryMethodId"]} noStyle>
        {() => {
          const deliveryMethodId = form.getFieldValue("deliveryMethodId");
          return (deliveryMethodId === 2 || deliveryMethodId === 3) &&
            <Form.Item
              name="deliveryAddress"
              label="Адрес доставки"
              rules={[
                {
                  required: true,
                  message: 'Введите адрес',
                  whitespace: true,
                },
              ]}
            >
              <Input/>
            </Form.Item>
        }}
      </Form.Item>
      <Form.Item
        name="deliveryDate"
        label="Дата доставки"
        rules={[
          {
            required: true,
            message: 'Укажите дату доставки',
          },
        ]}
      >
        <DatePicker
          format="DD.MM.YYYY"
          disabledDate={(current) => {
            if (current) {
              if (current.isBefore(moment("2022-07-05"))) {
                return true;
              }
              if (current.isSame(new Date(), "day")) {
                return false;
              }
              return current < moment().endOf('day');
            }
            return false;
          }}
        />
      </Form.Item>
      <Form.Item
        name="paymentMethod"
        label="Способ оплаты"
        rules={[
          {
            required: true,
            message: 'Укажите способ оплаты',
          },
        ]}
      >
        <Radio.Group>
          <Radio value="Наличные">Наличные</Radio>
          <Radio value="Карта">Карта</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
};

export default OrderFields;