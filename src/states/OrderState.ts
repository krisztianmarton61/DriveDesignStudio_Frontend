import { signal } from "@preact/signals-react";
import { IOrder } from "../types";

export const orders = signal<IOrder[]>([]);
export const order = signal<IOrder | undefined>(undefined);

export const setOrders = (value: IOrder[]) => {
  orders.value = value;
};
export const setOrder = (value: IOrder) => {
  order.value = value;
};
