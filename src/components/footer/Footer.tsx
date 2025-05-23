import React from "react";
import style from "./Footer.module.scss";

export const Footer: React.FC = () => {
  return (
    <footer className={style["footer"]}>
      <div className={style["footer-pages"]}>
        <div className={style["footer-item"]}>About</div>
        <div className={style["footer-item"]}>Contact</div>
        <div className={style["footer-item"]}>Privacy Policy</div>
        <div className={style["footer-item"]}>Terms of Service</div>
      </div>
      <div className={style["footer-end"]}>© 2024 DriveDesign Studio</div>
    </footer>
  );
};
