import React from "react";
import style from "./styles/Orders.module.scss";
import { OrderController } from "../../components";

export const OrderPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <OrderController />
    </div>
  );
};
