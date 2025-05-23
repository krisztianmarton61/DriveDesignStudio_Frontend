import { useEffect } from "react";
import { getOrders } from "../../../services";
import { orders, setAlert, setOrders } from "../../../states";
import { OrdersList } from "./OrdersList";
import { useSignals } from "@preact/signals-react/runtime";

export const OrdersController = () => {
  useSignals();
  useEffect(() => {
    getOrders(setAlert, setOrders);
  }, []);
  return (
    <>{orders.value.length > 0 ? <OrdersList orders={orders.value} /> : null}</>
  );
};
