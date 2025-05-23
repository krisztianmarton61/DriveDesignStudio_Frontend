import { FC } from "react";
import { useParams } from "react-router-dom";
import style from "./OrderConfirmation.module.scss";

export const OrderConfirmation: FC = () => {
  const { id } = useParams();

  return (
    <div className={style["order-confirmation-container"]}>
      <h1>Thank you for choosing us!</h1>
      <p>Your order has been placed: {id}</p>
    </div>
  );
};
