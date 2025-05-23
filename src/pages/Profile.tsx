import React from "react";
import style from "./styles/Profile.module.scss";
import { Profile } from "../components";

export const ProfilePage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <Profile />
    </div>
  );
};
