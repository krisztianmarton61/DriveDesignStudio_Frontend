import React from "react";
import style from "./styles/Home.module.scss";
import { HomeLanding } from "../components";

export const HomePage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <HomeLanding />
    </div>
  );
};
