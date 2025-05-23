import { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { getOrderById } from "../../../services";
import { useParams } from "react-router-dom";
import { order, setAlert, setOrder } from "../../../states";
import { Order } from "./Order";

export const OrderController = () => {
  useSignals();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (id) getOrderById(id, setAlert, setOrder);
  }, [id]);
  return (
    <>{order.value && order.value.id ? <Order order={order.value} /> : null}</>
  );
};
