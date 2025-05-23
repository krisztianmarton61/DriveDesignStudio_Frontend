import React, { useState } from "react";
import style from "./ProductPreview.module.scss";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useSignals } from "@preact/signals-react/runtime";

interface ProductPreviewProps {
  images: string | string[];
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ images }) => {
  useSignals();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <div className={style["image-container"]}>
        <img
          className={style["background-image"]}
          src="/mirror1.png"
          alt="Background image"
        />
        <img
          className={style["image-yarn"]}
          src="/black-yarn.png"
          alt="Product Image"
        />

        {typeof images === "string" ? (
          <img
            className={style["image-preview"]}
            src={images}
            alt="Product Image"
          />
        ) : (
          <img
            className={style["image-preview"]}
            src={"/src/assets/" + images[selectedImageIndex]}
            alt="Product Image"
          />
        )}
      </div>
      <div className={style["select-container"]}>
        {typeof images === "string" ? (
          <div className={`${style["select"]}`}>
            <img className={style["image"]} src={images} alt="Product Image" />
          </div>
        ) : (
          images.map((image, index) => (
            <div
              key={index}
              className={`${style["select"]} ${
                index === selectedImageIndex ? style["selected"] : ""
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                className={style["image"]}
                src={"/src/assets/" + image}
                alt="Product Image"
              />
              <div className={style["overlay"]}></div>
            </div>
          ))
        )}
        <div className={style["previous-button"]} onClick={handlePreviousImage}>
          <KeyboardArrowLeft />
        </div>
        <div className={style["next-button"]} onClick={handleNextImage}>
          <KeyboardArrowRight />
        </div>
      </div>
    </div>
  );
};
