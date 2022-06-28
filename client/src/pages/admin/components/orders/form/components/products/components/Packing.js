import React from 'react';
import {
  InputNumber
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import useDidUpdateEffect from "../../../../../../../../hooks/useDidUpdateEffect";
import './Packing.css';

const PACKING = [1, 2, 5];
const PACKING_RASPBERRIES = [0.5];

const getPackingValue = (productId) => {
  if (productId === 3) {
    return { title: "Фасовка: укажите кол-во ящиков объёмом 0.5 кг", values: PACKING_RASPBERRIES };
  }
  return { title: "Фасовка: укажите кол-во ящиков объёмами 1, 2 или 5 кг", values: PACKING };
}

const Packing = ({ value: formValue = "{}", onChange, productId }) => {
  const value = (typeof formValue === "string" ? JSON.parse(formValue) : formValue) || {};
  // const packingValue = getPackingValue(productId);
  const packingValue = { title: 'Укажите количество единиц товара', values: [1] };

  useDidUpdateEffect(() => {
    onChange("{}")
  }, [productId])

  return (
    <>
      <div className="packing-label">{packingValue.title}</div>
      <div className="packing-wrapper">
        {packingValue.values.map(packing =>
          <div key={packing} className="packing-input-wrapper">
            <div className="packing-input">
              <MinusOutlined style={{ fontSize: 20 }} onClick={() => {
                onChange(JSON.stringify({ ...value, [packing]: (value[packing] || 1) - 1 }))
              }}/>
              <InputNumber
                keyboard={false}
                onChange={(val) => {
                  onChange(JSON.stringify({ ...value, [packing]: val }));
                }}
                value={value[packing] || 0}
                min={0}
              />
              <PlusOutlined style={{ fontSize: 20 }} onClick={() => {
                onChange(JSON.stringify({ ...value, [packing]: (value[packing] || 0) + 1 }))
              }}/>
            </div>
          </div>)
        }
      </div>
    </>
  );
};

export default Packing;