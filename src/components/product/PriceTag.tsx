import React from "react";
import style from "./Price.module.scss";

interface PriceProps {
  price: string;
  oldPrice?: string;
  size?: "small" | "medium" | "large";
}

export const PriceTag: React.FC<PriceProps> = ({ price, oldPrice, size }) => {
  return (
    <div className={style["price-container"]}>
      <div className={style[`price-${size || "large"}`]}>{price} Lei</div>
      {oldPrice && (
        <div className={style[`old-price-${size || "large"}`]}>
          {oldPrice} Lei
        </div>
      )}
    </div>
  );
};
