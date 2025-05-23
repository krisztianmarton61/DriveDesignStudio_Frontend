import React from "react";
import { ForgotPassword } from "../../components";
import style from "../../styles/Page.module.scss";

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <ForgotPassword />
    </div>
  );
};
