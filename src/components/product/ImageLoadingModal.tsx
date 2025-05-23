import { FC } from "react";
import style from "./ImageLoadingModal.module.scss";
import { loadingOpen } from "../../states";
import { useSignals } from "@preact/signals-react/runtime";

interface ImageLoadingModalProps {
  text?: string;
}

export const ImageLoadingModal: FC<ImageLoadingModalProps> = ({ text }) => {
  useSignals();
  return (
    <>
      {loadingOpen.value && (
        <div className={style["modal"]}>
          <div className={style["loading-container"]}>
            <div className={style["loading-dots"]}>
              <span className={style["dot"]}></span>
              <span className={style["dot"]}></span>
              <span className={style["dot"]}></span>
              <span className={style["dot"]}></span>
            </div>
            <p>{text || ""}</p>
          </div>
        </div>
      )}
    </>
  );
};
