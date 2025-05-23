import React from "react";
import { SignIn } from "../../components";
import style from "../../styles/Page.module.scss";

export const SignInPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <SignIn />
    </div>
  );
};
