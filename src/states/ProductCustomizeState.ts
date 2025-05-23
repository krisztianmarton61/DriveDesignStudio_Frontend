import { signal } from "@preact/signals-react";

const activeStep = signal(0);

const setActiveStep = (step: number) => {
  activeStep.value = step;
};

export { activeStep, setActiveStep };
