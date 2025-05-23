import { effect, signal } from "@preact/signals-react";
import { IImage } from "../types";
import { getImage } from "../services";
import { setAlert } from "./AlertState";

export const imagesData = signal<IImage[]>([]);
export const images = signal<{
  [id: string]: string;
}>({});
export const lastEvaluatedKey = signal<string | undefined>("");
export const limit = signal<number>(5);

export const setLastEvaluatedKey = (value: string | undefined) => {
  lastEvaluatedKey.value = value;
};
export const setImages = (id: string, src: string) => {
  images.value = { ...images.value, [id]: src };
};

export const setImagesData = (imagesDatas: IImage[]) => {
  imagesData.value = imagesDatas;
};

effect(() => {
  const newImages = imagesData.value.filter((image) => !images.value[image.id]);

  newImages.forEach((image) => {
    getImage(setAlert, image.id).then((res) => {
      setImages(res.id, res.src);
    });
  });
});
