import React from "react";
import style from "./styles/Cart.module.scss";
import { Cart } from "../components";

export const CartPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <Cart />
    </div>
  );
};
