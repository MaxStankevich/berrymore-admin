import React, { useEffect } from 'react';
import './Packing.css';
import { getQuantityFromPacking } from "../../../../../../../../utils/order";

const Quantity = ({ value, onChange, form, fieldName }) => {
  const packing = form.getFieldValue(["products", fieldName, "packing"]);

  useEffect(() => {
    onChange(getQuantityFromPacking(packing));
  }, [packing])

  return (
    <div className="packing-quantity">
      Итого: {value || 0} кг
    </div>
  );
};

export default Quantity;