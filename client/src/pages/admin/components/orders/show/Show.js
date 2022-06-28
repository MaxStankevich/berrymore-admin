import React, { useState, useEffect, Fragment } from "react";
import { Descriptions, Button, notification } from "antd";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";
import StatusTag from "../../../../../components/status-tag/StatusTag";

const ShowOrder = () => {
  const [order, setOrder] = useState();
  const { id } = useParams();

  const fetchOrder = () => {
    request.get(`/orders/${id}`).then(res => {
      if (order && JSON.stringify(order) !== JSON.stringify(res.data)) {
        notification.warning({
          message: "Внимание! Этот заказ был изменён другим пользователем. Проверьте актуальность данных.",
          duration: 0
        })
        setOrder(res.data);
      }
      if (!order) {
        setOrder(res.data);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    fetchOrder();
  }, [id])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrder();
    }, 60000);

    return () => {
      clearInterval(interval)
    }
  }, [id, order])

  return (
    order ?
      <Descriptions
        bordered
        title="Информация о заказе"
        extra={
          <Link to={`/orders/${id}/edit`}><Button
            type="primary">Редактировать</Button></Link>}
      >
        <Descriptions.Item label="Номер заказа">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Предмет заказа">{(order.products || []).map(product => {
          const packing = JSON.parse(product.order_product.packing || "{}");
          return (
            <Fragment key={product.id}>
              {product.name}: {product.order_product.quantity.replace(/\.0+$/,'')} x {product.unit}
              {/* ({Object.keys(packing).map(key => packing[key] ?
              <span key={key}>{key} × {product.unit}</span> : null)}) */}
              <br/>
            </Fragment>
          )
        })}</Descriptions.Item>
        <Descriptions.Item label="К оплате">
          {
            String(order.totalAmount || (order.products || []).reduce((result, product = {}) => {
              return result + ((product.order_product.quantity * product.price) || 0);
            }, 0)).replace(/\.0+$/,'')
          } BYN
        </Descriptions.Item>
        <Descriptions.Item label="Способ доставки">{order.deliveryMethod.name}</Descriptions.Item>
        {order.deliveryMethod.id === 2 && order.deliveryAddress &&
        <Descriptions.Item label="Адрес доставки">{order.deliveryAddress}</Descriptions.Item>}
        <Descriptions.Item
          label="Время доставки">{moment(order.deliveryDate).format("D MMMM YYYY")}<br/>{order.deliveryTime}
        </Descriptions.Item>
        <Descriptions.Item label="Способ оплаты">{order.paymentMethod}</Descriptions.Item>
        <Descriptions.Item label="Статус"><StatusTag {...order.orderStatus} /></Descriptions.Item>
        <Descriptions.Item label="Ответственный">
          {order.user ?
            <>
              {order.user.fullName &&
              <>
                {order.user.fullName}
                <br/>
              </>
              }
              {order.user.username}
              <br/>
              {order.user.email}
              <br/>
            </> :
            "Не назначен"
          }
        </Descriptions.Item>
        <Descriptions.Item label="Заказчик">
          <Link to={`/customers/${order.customer.id}`}>
            {order.customer.name}
            <br/>
            {order.customer.email}
            <br/>
            {`+375${order.customer.phoneNumber}`}
          </Link>
        </Descriptions.Item>
        {order.notes && <Descriptions.Item label="Доп. комментарии">{order.notes}</Descriptions.Item>}
        <Descriptions.Item label="Создан">{moment(order.createdAt).format('D MMMM YYYY, HH:mm')}</Descriptions.Item>
        <Descriptions.Item label="История">
          {order.orderStatusHistories.map(history => (
            <Fragment key={history.id}>
              <b>{history.statusName}:</b> {moment(history.createdAt).format('D MMMM YYYY, HH:mm')}
              <br/>
            </Fragment>
          ))}
        </Descriptions.Item>
      </Descriptions> : <Spinner size="large"/>
  )
}

export default ShowOrder;