import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import style from "./HorizontalLinearStepper.module.scss";

interface HorizontalLinearStepperProps {
  steps: string[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  hideNextButton?: number[];
  hideBackButton?: number[];
  optionalSteps?: number[];
}

export const HorizontalLinearStepper = ({
  steps,
  activeStep,
  setActiveStep,
  optionalSteps,
  hideNextButton,
  hideBackButton,
}: HorizontalLinearStepperProps) => {
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return optionalSteps?.includes(step) ?? false;
  };

  const isNextButtonHidden = (step: number) => {
    return hideNextButton?.includes(step) ?? false;
  };

  const isBackButtonHidden = (step: number) => {
    return hideBackButton?.includes(step) ?? false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(activeStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(activeStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={style["stepper-container"]}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step
              key={label}
              {...stepProps}
              sx={{
                "& .Mui-completed": {
                  color: "#e83e53",
                },
                "& .Mui-active": {
                  color: "#e83e53",
                },
              }}
            >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            {isBackButtonHidden(activeStep) ? null : (
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            )}
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            {isNextButtonHidden(activeStep) ? null : (
              <Button
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                Next
              </Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </div>
  );
};
