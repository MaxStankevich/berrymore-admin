import React from 'react';
import {
  InputNumber
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './Packing.css';

const PACKING = [1, 2, 5];

const Packing = ({ value: formValue = "{}", onChange }) => {
  const value = (typeof formValue === "string" ? JSON.parse(formValue) : formValue) || {};

  return (
    <>
      <div className="packing-label">Фасовка: укажите кол-во ящиков объёмами (1, 2 или 5 кг)</div>
      <div className="packing-wrapper">
        {PACKING.map(packing =>
          <div key={packing} className="packing-input-wrapper">
            <div className="packing-input-label">{packing}кг</div>
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