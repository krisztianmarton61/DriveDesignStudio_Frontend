import React from "react";
import style from "./CustomizeProductModal.module.scss";
import { activeStep, image, setActiveStep, setEditedImage } from "../../states";
import ClearIcon from "@mui/icons-material/Clear";
import { customizeOpen, setCustomizeOpen } from "../../states";
import { useSignals } from "@preact/signals-react/runtime";
import { HorizontalLinearStepper } from "../steppers";
import { SelectImageComponent } from "./SelectImageComponent";
import { Editor } from "./Editor";

export const CustomizeProductModal: React.FC = () => {
  useSignals();
  const onClose = () => {
    setCustomizeOpen(false);
    setActiveStep(0);
  };

  const handleSaveImage = async (image: string) => {
    setEditedImage(image);
    setActiveStep(0);
    setCustomizeOpen(false);
  };

  return (
    customizeOpen.value && (
      <>
        <div className={style["modal"]}>
          <HorizontalLinearStepper
            activeStep={activeStep.value}
            setActiveStep={setActiveStep}
            steps={[
              "Select image",
              "Remove background",
              "Select shape",
              "Add text",
            ]}
            hideNextButton={[0]}
          />
          {activeStep.value === 0 && <SelectImageComponent />}
          {activeStep.value === 1 ||
          activeStep.value === 2 ||
          activeStep.value === 3 ? (
            <Editor
              step={
                activeStep.value === 1
                  ? "remove background"
                  : activeStep.value === 2
                    ? "shape selection"
                    : "text selection"
              }
              onSave={handleSaveImage}
              image={image}
              onCLose={onClose}
            />
          ) : null}
          <div className={style["close"]} onClick={onClose}>
            <ClearIcon />
          </div>
        </div>
      </>
    )
  );
};
