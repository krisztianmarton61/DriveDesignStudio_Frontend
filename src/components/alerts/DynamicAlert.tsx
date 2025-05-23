import React from "react";
import { Alert, alert, AlertType } from "../../states";
import { ErrorOutlineOutlined, TaskAlt } from "@mui/icons-material";
import style from "./DynamicAlert.module.scss";
import { useSignalEffect } from "@preact/signals-react";

export const DynamicAlert: React.FC = () => {
  const [alertQueue, setAlertQueue] = React.useState<Alert[]>([]);

  useSignalEffect(() => {
    if (alert.value !== undefined) {
      setAlertQueue((prev) => [...prev, alert.value as Alert]);
      removeAlert(alert.value, 5);
    }
  });

  const removeAlert = (alert: Alert, seconds: number) => {
    setTimeout(() => {
      setAlertQueue((prev) => prev.filter((a) => a !== alert));
    }, 1000 * seconds);
  };

  return (
    alertQueue.length !== 0 && (
      <div className={style["alert-container"]}>
        {alertQueue.map((alert, index) => (
          <div
            key={index}
            className={`${style["alert"]} ${style[`alert-${alert.type}`]}`}
          >
            {alert.type === AlertType.Error ? (
              <ErrorOutlineOutlined />
            ) : (
              <TaskAlt />
            )}
            {alert.message}
          </div>
        ))}
      </div>
    )
  );
};
