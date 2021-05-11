export const getOrdersParams = () => {
  const value = localStorage.getItem("ordersParams");
  return value ? JSON.parse(value) : { page: 1, size: 10, filter: {}, order: '[["createdAt", "DESC"]]' };
}

export const setOrdersParams = (data) => {
  localStorage.setItem("ordersParams", JSON.stringify(data))
}

export const getQuantityFromPacking = (packing) => {
  if (!packing) return;
  const value = typeof packing === "string" ? JSON.parse(packing) : packing;
  return Object.keys(value).reduce((acc, key) => {
    return acc + value[key] * Number(key);
  }, 0);
}