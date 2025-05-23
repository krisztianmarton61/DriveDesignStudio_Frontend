import React from "react";
import style from "./Header.module.scss";
import { Person, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { cartCount } from "../../states";
import { useSignals } from "@preact/signals-react/runtime";

export const Header: React.FC = () => {
  useSignals();
  const navigate = useNavigate();
  return (
    <div className={style["header"]}>
      <div className={style["header-left"]}>
        <div className={style["header-item"]} onClick={() => navigate("/")}>
          <img
            className={style["header-item-icon"]}
            src="/logo_car.svg"
            alt="logo"
          />
        </div>
      </div>
      <div className={style["header-right"]}>
        <div
          className={style["header-item"]}
          onClick={() => navigate("/profile")}
        >
          <Person className={style["header-item-icon"]} />
        </div>
        <div>
          <div
            className={style["header-item"]}
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className={style["header-item-icon"]} />
          </div>
          {cartCount.value > 0 && (
            <div className={style["cart-count"]}>{cartCount.value}</div>
          )}
        </div>
      </div>
    </div>
  );
};
