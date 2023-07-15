import React, { useEffect } from 'react';
import {
  Form,
  Select,
} from 'antd';

const DeliveryMethod = ({ form }) => {
  const productsValue = form.getFieldValue("products") || [];
  const deliveryMethodId = form.getFieldValue("deliveryMethodId");
  const totalQuantity = productsValue.reduce((result, val = {}) => {
    return result + (val.quantity || 0);
  }, 0)
  const yandexDeliveryAvailable = totalQuantity >= 10;

  useEffect(() => {
    if (deliveryMethodId === 3 && !yandexDeliveryAvailable) {
      form.setFieldsValue({ deliveryMethodId: 1 })
    }
  }, [deliveryMethodId, yandexDeliveryAvailable])

  return (
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
        <Select.Option value={1}>Самовывоз (16:00-22:00 г. Минск, ул. Ильянская 4)</Select.Option>
        {/* <Select.Option value={2}>Доставка по микрорайону Лебяжий 16:00-22:00 (бесплатно)</Select.Option> */}
        <Select.Option
          disabled={!yandexDeliveryAvailable}
          value={3}
        >
          Яндекс доставка за счет продавца {!yandexDeliveryAvailable && "(доступно при заказа от 10 кг)"}
        </Select.Option>
      </Select>
    </Form.Item>
  )
}

export default DeliveryMethod;