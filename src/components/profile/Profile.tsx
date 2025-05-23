import React from "react";
import style from "./Profile.module.scss";
import { OrdersController, SignIn, SignUpConfirm } from "../../components";
import { signOut, user } from "../../states";

enum Panels {
  information = "Information",
  orders = "Orders",
  settings = "Settings",
}

export const Profile: React.FC = () => {
  const [activePanel, setActivePanel] = React.useState<Panels>(
    Panels.information
  );

  console.log(user.value);
  console.log(user.value?.email_verified);

  if (user.value && user.value.email_verified) {
    return (
      <div className={style["profile-container"]}>
        <div className={style["navigation-panel-container"]}>
          <div
            className={`${style["navigation-panel-item"]} ${
              activePanel === Panels.information ? style["active"] : ""
            }`}
            onClick={() => setActivePanel(Panels.information)}
          >
            Information
          </div>
          <div
            className={`${style["navigation-panel-item"]} ${
              activePanel === Panels.orders ? style["active"] : ""
            }`}
            onClick={() => setActivePanel(Panels.orders)}
          >
            Orders
          </div>
          <div
            className={`${style["navigation-panel-item"]} ${
              activePanel === Panels.settings ? style["active"] : ""
            }`}
            onClick={() => setActivePanel(Panels.settings)}
          >
            Settings
          </div>
        </div>
        <div className={style["profile-panel-container"]}>
          <div>
            <div className={style["profile-panel-title"]}>{activePanel}</div>
            <div className={style["profile-panel-content"]}>
              {activePanel === Panels.information && (
                <>
                  <div>Email: {user.value?.email}</div>
                  <div onClick={() => signOut()}>SignOut</div>
                </>
              )}
              {activePanel === Panels.orders && (
                <>
                  <OrdersController />
                </>
              )}
              {activePanel === Panels.settings && (
                <div>
                  <div>SETTINGS</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.value && !user.value.email_verified) {
    return <SignUpConfirm />;
  }

  return <SignIn />;
};
