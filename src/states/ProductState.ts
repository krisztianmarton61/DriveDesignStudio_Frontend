import { effect, signal } from "@preact/signals-react";
import { activeStep } from "./ProductCustomizeState";

export enum IStyle {
  Charcoal = "Charcoal",
  OilPainting = "Oil Painting",
  Watercolor = "Watercolor",
  Pointillism = "Pointillism",
  Acrylic = "Acrylic",
}

export const recommendedImages = [
  "example1.png",
  "example2.png",
  "example3.png",
  "example4.png",
  "example5.png",
];

export const image = signal("");
export const imageWithoutBackground = signal("");
export const editedImage = signal("");
export const prompt = signal("");
export const imageStyle = signal<undefined | IStyle>(undefined);
export const editorOpen = signal(false);
export const loadingOpen = signal(false);
export const customizeOpen = signal(false);

export const setImageStyle = (value: IStyle | undefined) => {
  imageStyle.value = value;
};

export const setImage = (value: string) => {
  image.value = value;
};

export const setImageWithoutBackground = (value: string) => {
  imageWithoutBackground.value = value;
};

export const setEditedImage = (value: string) => {
  editedImage.value = value;
};

export const setPrompt = (value: string) => {
  prompt.value = value;
};

export const setEditorOpen = (value: boolean) => {
  editorOpen.value = value;
};

export const setLoadingOpen = (value: boolean) => {
  loadingOpen.value = value;
};

export const setCustomizeOpen = (value: boolean) => {
  customizeOpen.value = value;
};

effect(() => {
  if (image.value !== "") {
    activeStep.value = 1;
  }
});
