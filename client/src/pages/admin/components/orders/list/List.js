import React, { Fragment } from 'react';
import { Table, Space, Button, notification } from 'antd';
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import StatusTag from "../../../../../components/status-tag/StatusTag";
import DeleteAction from "../../../../../components/delete-action/DeleteAction";
import request from "../../../../../utils/request";
import useAuth from "../../../../../hooks/useAuth";


const OrdersList = ({ orders, loading, showCustomer = true, fetchOrders }) => {
  const [user] = useAuth();
  const history = useHistory();

  const takeOrder = (id) => {
    request.put(`/orders/${id}`, { orderStatusId: 2, userId: user.id })
      .then(() => {
        notification.success({ message: "Заказ успешно принят вами" })
        history.push(`/orders/${id}`)
      })
      .catch(() => {
        notification.error({ message: "Не удалось принять заказ" })
      })
  }

  const columns = [
    {
      title: 'Номер заказа',
      dataIndex: 'id',
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'createdAt',
      render: createdAt => (
        moment(createdAt).format('D MMMM YYYY, HH:mm')
      ),
    },
    {
      title: 'Предмет заказа',
      dataIndex: "products",
      render: products => (
        products && !!products.length && products.map(product => (
          <Fragment key={product.id}>
            {`${product.name} (${product.unit} x ${product.order_product.quantity.replace(/\.0+$/, '')})`}
            <br/>
          </Fragment>
        ))
      ),
    },
    {
      title: 'К оплате',
      dataIndex: "products",
      render: (products, record) => {
        const amount = record.totalAmount || (products || []).reduce((result, product = {}) => {
          return result + ((product.order_product.quantity * product.price) || 0);
        }, 0)
        return (
          products && !!products.length && `${String(amount).replace(/\.0+$/, '')} BYN`
        )
      },
    },
    ...(showCustomer ? [{
      title: 'Заказчик',
      dataIndex: "customer",
      render: customer =>
        <Link to={`/customers/${customer.id}`}>
          {customer.name} +375{customer.phoneNumber}
        </Link>
    }] : []),
    {
      title: 'Статус',
      dataIndex: "orderStatus",
      render: status => (
        <StatusTag id={status.id} name={status.name}/>
      ),
    },
    {
      title: 'Ответственный',
      dataIndex: "user",
      render: user => (
        user && `${user.fullName || ""}${user.fullName && user.username ? ", " : ""}${user.username}`
      ),
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <DeleteAction
            url={`/orders/${record.id}`}
            onSuccess={fetchOrders}
            successMessage="Заказ был успешно удалён"
            errorMessage="Не удалось удалить заказ"
          />
          <Link to={`/orders/${record.id}/edit`}><Button
            type="primary" ghost
            size="small">Редактировать</Button></Link>
          <Link to={`/orders/${record.id}`}><Button
            size="small">Детали</Button></Link>
          {record.orderStatusId === 1 && !record.userId &&
          <Button
            size="small"
            type="primary"
            onClick={() => {
              takeOrder(record.id);
            }}
          >
            Принять
          </Button>
          }
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} pagination={false}/>
  )
}


export default OrdersList