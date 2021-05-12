import React from 'react';
import moment from 'moment';
import {
  Form,
  Input,
  Select,
  DatePicker, Radio,
} from 'antd';

const OrderFields = ({ form }) => {
  return (
    <>
      <Form.Item
        name="deliveryMethodId"
        label="Способ доставки"
        rules={[
          {
            required: true,
            message: 'Укажите способ доставки',
          },
        ]}
      >
        <Select>
          <Select.Option value={1}>Самовывоз (г. Минск, ул. Ильянская 4)</Select.Option>
          <Select.Option value={2}>Доставка по микрорайону Лебяжий</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item dependencies={["deliveryMethodId"]} noStyle>
        {() => {
          return form.getFieldValue("deliveryMethodId") === 1 ? null :
            <>
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
                <DatePicker format="DD.MM.YYYY" disabledDate={(current) => current && current < moment().endOf('day')}/>
              </Form.Item>
              <Form.Item
                name="deliveryTime"
                label="Время доставки"
                rules={[
                  {
                    required: true,
                    message: 'Укажите время доставки',
                  },
                ]}
              >
                <Select>
                  <Select.Option value="9:00-12:00">9:00-12:00</Select.Option>
                  <Select.Option value="16:00-22:00">16:00-22:00</Select.Option>
                </Select>
              </Form.Item>
            </>
        }}
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
      {/*<Form.Item shouldUpdate dependencies={["deliveryMethodId"]} noStyle>
        {() => {
          return form.getFieldValue("deliveryMethodId") === 1 ? null :
            <>
              <Form.Item
                name="contactSurname"
                label="Фамилия"
                rules={[
                  {
                    required: true,
                    message: 'Введите фамилию',
                    whitespace: true,
                  },
                ]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name="contactPatronymic"
                label="Отчество"
                rules={[
                  {
                    required: true,
                    message: 'Введите отчество',
                    whitespace: true,
                  },
                ]}
              >
                <Input/>
              </Form.Item>
            </>
        }}
      </Form.Item>*/}
    </>
  );
};

export default OrderFields;