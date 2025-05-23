import { useCallback, useEffect, useState } from "react";
import { IImage } from "../../types";
import { getImagesData } from "../../services";
import {
  images,
  imagesData,
  lastEvaluatedKey,
  setAlert,
  setImage,
  setImagesData,
  setLastEvaluatedKey,
} from "../../states";
import style from "./Explore.module.scss";
import { useSignals } from "@preact/signals-react/runtime";

export const Explore = () => {
  useSignals();
  const [limit] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(true);

  const onLoadMore = useCallback(() => {
    if (lastEvaluatedKey.value === undefined) return;
    getImagesData(
      (newImagesData) => setImagesData([...imagesData.value, ...newImagesData]),
      setIsLoading,
      setLastEvaluatedKey,
      setAlert,
      {
        limit,
        exclusiveStartKey:
          lastEvaluatedKey.value !== "" ? lastEvaluatedKey.value : undefined,
      }
    );
  }, [limit]);

  const setImageData = (imagesData: IImage[]) => {
    setImagesData(imagesData);
  };

  useEffect(() => {
    getImagesData(setImageData, setIsLoading, setLastEvaluatedKey, setAlert, {
      limit: 5,
    });
  }, []);

  return (
    <>
      {images && (
        <div className={style["image-container"]}>
          {imagesData.value.map((image) =>
            image && images.value[image.id] ? (
              <div
                className={style["image"]}
                onClick={() => setImage(images.value[image.id])}
              >
                <img
                  key={image.id}
                  src={images.value[image.id]}
                  alt={image.id}
                />
              </div>
            ) : (
              <div className={style["image-placeholder"]}>
                <div className={style["loading-circle"]}></div>
              </div>
            )
          )}
        </div>
      )}
      <div>
        {isLoading && <div>Loading...</div>}

        <div className={style["load-more"]} onClick={onLoadMore}>
          Load more...
        </div>
      </div>
    </>
  );
};
