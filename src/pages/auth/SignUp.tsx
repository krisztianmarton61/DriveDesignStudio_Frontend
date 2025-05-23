import React from "react";
import { SignUp } from "../../components";
import style from "../../styles/Page.module.scss";

export const SignUpPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <SignUp />
    </div>
  );
};
