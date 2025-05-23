import React from "react";
import style from "./Product.module.scss";
import { ProductController } from "../../components";

export const ProductPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <ProductController />
    </div>
  );
};
