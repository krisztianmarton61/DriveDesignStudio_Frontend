import React from "react";
import { SignUpConfirm } from "../../components";
import style from "../../styles/Page.module.scss";

export const SignUpConfirmPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <SignUpConfirm />
    </div>
  );
};
