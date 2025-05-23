import { Signal, signal } from "@preact/signals-react";

export enum AlertType {
  Error = "error",
  Success = "success",
}

export type Alert = {
  type: AlertType;
  message: string;
};

export const alert: Signal<Alert | undefined> = signal(undefined);

export const setAlert = (newAlert: Alert) => {
  alert.value = newAlert;
};
