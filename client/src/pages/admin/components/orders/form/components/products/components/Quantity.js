import React, { useEffect } from 'react';
import './Packing.css';
import { getQuantityFromPacking } from "../../../../../../../../utils/order";

const Quantity = ({ value, onChange, form, fieldName, products }) => {
  const packing = form.getFieldValue(["products", fieldName, "packing"]);
  const id = form.getFieldValue(["products", fieldName, "id"]);
  const product = products.find((pr => pr.id === id)) || {};
  const totalPrice = (product.price * value) || 0;

  useEffect(() => {
    onChange(getQuantityFromPacking(packing));
  }, [packing])

  return (
    <div className="packing-quantity">
      {/* <div>Итого: {value || 0} кг</div> */}
      <div>{totalPrice ? `${totalPrice} BYN` : null}</div>
    </div>
  );
};

export default Quantity;