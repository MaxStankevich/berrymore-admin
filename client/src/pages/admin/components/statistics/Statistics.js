import React, { Fragment, useState, useEffect } from "react";
import { DatePicker, Descriptions } from "antd";
import { Pie } from '@ant-design/charts';
import { groupBy } from 'lodash-es';
import request from "../../../../utils/request";

const Statistics = () => {
  const [orders, setOrders] = useState({ data: [] });
  const [loading, setLoading] = useState();
  const [params, setParams] = useState({
    page: 1,
    size: 10000,
    createdAt: null,
  });

  const products = orders.data.reduce((acc, order) => {
    return acc.concat(order.products.map(prod => ({
      ...prod,
      orderStatusId: order.orderStatusId,
      orderStatusName: order.orderStatus.name
    })));
  }, [])

  const productsByName = groupBy(products, "name");
  const ordersByStatus = groupBy(orders.data, "orderStatus.name");

  let totalMoney = 0;

  const moneyData = Object.keys(ordersByStatus).map(status => {
    const orders = ordersByStatus[status];
    const money = orders.reduce((moneyResult, order) => {
      const amount = order.totalAmount || order.products.reduce((acc, item) => {
        acc += Number(item.order_product.quantity) * Number(item.price);
        return acc;
      }, 0);
      return moneyResult + Number(amount);
    }, 0)

    totalMoney += money;

    const currentProducts = orders.reduce((acc, order) => {
      return acc.concat(order.products.map(prod => ({
        ...prod,
        orderStatusId: order.orderStatusId,
        orderStatusName: order.orderStatus.name
      })));
    }, [])
    const productsByName = groupBy(currentProducts, "name");
    const productsQuantity = Object.keys(productsByName).map(key => {
      const value = productsByName[key].reduce((acc, item) => {
        acc += Number(item.order_product.quantity * (item.unitWeight || 1));
        return acc
      }, 0);

      return ({
        type: key,
        value: value
      })
    });

    return {
      status,
      money,
      quantity: productsQuantity,
    }
  });

  const data = Object.keys(productsByName).map(key => {
    const value = productsByName[key].reduce((acc, item) => {
      acc.all += Number(item.order_product.quantity * (item.unitWeight || 1));
      if (item.orderStatusId === 1) {
        acc.raw += Number(item.order_product.quantity * (item.unitWeight || 1));
      }
      return acc
    }, { all: 0, raw: 0 });

    return ({
      type: key,
      // label: `${value.all}кг (${value.raw}кг не обработано)`,
      value: value.all
    })
  });

  const totalProducts = data.reduce((acc, item) => {
    return acc + Number(item.value)
  }, 0)

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      autoRotate: false,
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 17,
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        formatter: () => `Всего ${totalProducts}`,
      },
    },
  };

  const updateParams = (data) => {
    setParams(prevParams => ({ ...prevParams, ...data }));
  }

  useEffect(() => {
    setLoading(true);
    request.get("/orders", {
      params
    }).then(res => {
      setOrders(res.data);
    }).catch(() => {
    }).finally(() => {
      setLoading(false);
    })
  }, [params])

  return (
    <>
      <DatePicker.RangePicker style={{ marginBottom: "50px", width: 300 }} onChange={(value, str) => {
        updateParams({ createdAt: JSON.stringify(str) })
      }}/>
      <Descriptions
        title="Сумма по статусам (BYN)"
        bordered
        layout="vertical"
        style={{ marginBottom: 50 }}
      >
        {moneyData.map(item => (
          <Descriptions.Item key={item.status} label={item.status}>
            {item.quantity.map(prod => <Fragment key={prod.type}><b>{prod.type}:</b> {prod.value} кг<br/></Fragment>)}
            {item.money} BYN
          </Descriptions.Item>
        ))}
        <Descriptions.Item label="Всего">
          {data.map(prod => <Fragment key={prod.type}><b>{prod.type}:</b> {prod.value} кг<br/></Fragment>)}
          {totalMoney} BYN
        </Descriptions.Item>
      </Descriptions>
      <Pie {...config} loading={loading}/>
    </>
  )
}

export default Statistics;