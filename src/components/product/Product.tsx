import React, { useState } from "react";
import style from "./Product.module.scss";
import { CustomizeProductModal } from "./CustomizeProductModal";
import {
  addToCart,
  editedImage,
  recommendedImages,
  setAlert,
  setCustomizeOpen,
} from "../../states";
import { PriceTag } from "./PriceTag";
import { IProduct } from "../../types";
import { LocalShipping, LocationOn, Shield } from "@mui/icons-material";
import { useSignals } from "@preact/signals-react/runtime";
import { postImage } from "../../services";
import { ImageLoadingModal } from "./ImageLoadingModal";
import { ProductPreview } from "./ProductPreview";

interface ProductProps {
  product: IProduct;
}

export const Product: React.FC<ProductProps> = ({ product }) => {
  useSignals();
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!editedImage) {
      return;
    }
    const imageId = await postImage(
      editedImage.value,
      setIsAddToCartLoading,
      setAlert
    );
    if (imageId === "") {
      return;
    }
    addToCart({ productId: product.id, imageId });
  };

  const onClickCostumizeProduct = () => {
    setCustomizeOpen(true);
  };

  return (
    <>
      <>
        <div className={style["product-container"]}>
          <div className={style["product-top"]}>
            <div className={style["designer-container"]}>
              <div className={style["preview"]}>
                <ProductPreview
                  images={
                    editedImage.value !== ""
                      ? editedImage.value
                      : recommendedImages
                  }
                />
              </div>
            </div>
            <div className={style["product-details"]}>
              <h1>{product.name}</h1>
              <PriceTag price={product.price} oldPrice={product.oldPrice} />

              {editedImage.value !== "" && (
                <button
                  className={style["secondary"]}
                  onClick={handleAddToCart}
                >
                  {isAddToCartLoading ? (
                    <>
                      Adding to cart
                      <div className={style["loading-dots"]}>
                        <span className={style["dot"]}></span>
                        <span className={style["dot"]}></span>
                        <span className={style["dot"]}></span>
                      </div>
                    </>
                  ) : (
                    "Add to cart"
                  )}
                </button>
              )}

              <button
                className={style["primary"]}
                onClick={onClickCostumizeProduct}
              >
                Customize product
              </button>
              <div className={style["divider"]}></div>
              <div className={style["information"]}>
                <LocalShipping />
                <span>
                  <b>Free shipping</b> on orders over 150 Lei
                </span>
              </div>
              <div className={style["information"]}>
                <LocationOn />
                <span>
                  <b>Shipping everywhere in Romania</b> from 14.99 Lei
                </span>
              </div>
              <div className={style["information"]}>
                <Shield />
                <span>
                  <b>Product protection</b> free replacement for any product
                  damaged upon delivery.
                </span>
              </div>
            </div>
          </div>
          <div className={style["description"]}>
            <h1>Description</h1>
            <div className={style["divider"]}></div>
            <p>{product.description}</p>
          </div>
        </div>
        {<CustomizeProductModal />}
        {
          <ImageLoadingModal text="Generating image, it usually takes between 10 and 30 seconds, do not close this tab!" />
        }
      </>
    </>
  );
};
