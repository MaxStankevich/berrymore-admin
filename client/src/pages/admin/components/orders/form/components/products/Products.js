import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Button,
  Row,
  Col,
  notification
} from 'antd';
import { PlusOutlined, DeleteTwoTone } from '@ant-design/icons';
import request from "../../../../../../../utils/request";
import { tailFormItemLayout } from "../../../../../../../config/formLayout";
import Packing from "./components/Packing";
import Quantity from "./components/Quantity";

const { Option } = Select;

const OrderForm = ({ form }) => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    setProductsLoading(true);
    request.get("/products").then(res => {
      setProducts(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить заказчиков" })
    }).finally(() => {
      setProductsLoading(false);
    })
  }, [setProducts, setProductsLoading])

  return (
    <Form.List name="products">
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map(field => {
              return (
                <div className="product-item" key={field.key}>
                  <Row gutter={24} align="middle">
                    <Col xs={16}>
                      <Form.Item
                        noStyle
                        shouldUpdate
                      >
                        {() => {
                          const values = form.getFieldValue("products") || [];
                          const selectedIds = values.filter(val => val && val.id).map(val => val.id);
                          return (
                            <Form.Item
                              {...field}
                              label="Товар"
                              name={[field.name, 'id']}
                              fieldKey={[field.fieldKey, 'id']}
                              rules={[{ required: true, message: 'Выберите товар' }]}
                            >
                              <Select disabled={productsLoading}>
                                {products.map(item => (
                                  <Option disabled={selectedIds.includes(item.id)} key={item.id} value={item.id}>
                                    {item.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          )
                        }}
                      </Form.Item>
                    </Col>
                    <Col xs={1}>
                      <Button type="text" danger onClick={() => remove(field.name)}>
                        <DeleteTwoTone twoToneColor="red"/>
                        Удалить
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Form.Item
                      {...field}
                      name={[field.name, 'packing']}
                      fieldKey={[field.fieldKey, 'packing']}
                      label="Фасовка"
                      noStyle
                    >
                      <Packing/>
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item shouldUpdate>
                      {() => {
                        return (
                          <Form.Item
                            {...field}
                            name={[field.name, 'quantity']}
                            fieldKey={[field.fieldKey, 'quantity']}
                            noStyle
                          >
                            <Quantity form={form} fieldName={field.name}/>
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </Row>
                </div>
              )
            })}

            {fields.length < products.length &&
            <Form.Item {...tailFormItemLayout}>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined/>}>
                Добавить товар
              </Button>
            </Form.Item>
            }
          </>
        )
      }}
    </Form.List>
  );
};

export default OrderForm;