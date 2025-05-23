import React from "react";
import style from "./styles/Cart.module.scss";
import { Checkout } from "../components";

export const CheckoutPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <Checkout />
    </div>
  );
};
