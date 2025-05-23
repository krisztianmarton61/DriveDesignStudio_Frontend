import React from "react";
import style from "./styles/Orders.module.scss";
import { OrdersController } from "../../components";

export const OrdersPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <OrdersController />
    </div>
  );
};
