import React, { useState, useEffect } from "react";
import { DatePicker, Descriptions } from "antd";
import { Pie } from '@ant-design/charts';
import { groupBy } from 'lodash-es';
import moment from 'moment';
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
  const productsByStatus = groupBy(products, "orderStatusName");

  let totalMoney = 0;
  const moneyData = Object.keys(productsByStatus).map(status => {
    const value = productsByStatus[status].reduce((acc, item) => {
      acc += Number(item.order_product.quantity) * Number(item.price);
      return acc;
    }, 0);

    totalMoney += value;

    return ({
      status,
      value
    })
  });

  const data = Object.keys(productsByName).map(key => {
    const value = productsByName[key].reduce((acc, item) => {
      acc.all += Number(item.order_product.quantity);
      if (item.orderStatusId === 1) {
        acc.raw += Number(item.order_product.quantity);
      }
      return acc
    }, { all: 0, raw: 0 });

    return ({
      type: key,
      label: `${value.all}кг (${value.raw}кг не обработано)`,
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
        title={params.createdAt ? `За период ${JSON.parse(params.createdAt).map(time => `${moment(time).format('D MMMM YYYY')}, 00:00`).join(" - ")}` : "За всё время"}
        bordered
        layout="vertical"
        style={{ marginBottom: 50 }}
      >
        {data.map(item => <Descriptions.Item key={item.type} label={item.type}>{item.label}</Descriptions.Item>)}
        <Descriptions.Item label="Всего">{totalProducts}кг</Descriptions.Item>
      </Descriptions>
      <Descriptions
        title="Сумма по статусам (BYN)"
        bordered
        layout="vertical"
        style={{ marginBottom: 50 }}
      >
        {moneyData.map(item => (
          <Descriptions.Item key={item.status} label={item.status}>
            {item.value} BYN
          </Descriptions.Item>
        ))}
        <Descriptions.Item label="Всего">{totalMoney} BYN</Descriptions.Item>
      </Descriptions>
      <Pie {...config} loading={loading}/>
    </>
  )
}

export default Statistics;