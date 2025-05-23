import { FC, useState } from "react";
import {
  addQuantity,
  cart,
  cartCount,
  cartImages,
  deleteFromCart,
  products,
  setAlert,
  setProduct,
  shippingCost,
  subtractQuantity,
} from "../../states";
import style from "./Cart.module.scss";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { getImage, getProduct } from "../../services";
import { useNavigate } from "react-router-dom";
import { PriceTag } from "../product";

export const Cart: FC = () => {
  useSignals();
  const navigate = useNavigate();
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [cartImagesLoaded, setCartImagesLoaded] = useState(false);

  useSignalEffect(() => {
    const newProducts = cart.value.filter(
      (item) => !products.value[item.productId]
    );
    const promises = newProducts.map(async (item) => {
      await getProduct(item.productId, setAlert, setProduct);
    });
    Promise.all(promises).then(() => setProductsLoaded(true));
  });

  useSignalEffect(() => {
    if (cartCount.value === 0) {
      return;
    }
    const promises = cart.value.map(async (item) => {
      if (cartImages.value[item.imageId]) {
        return;
      }
      const image = await getImage(setAlert, item.imageId);
      if (image) {
        cartImages.value[item.imageId] = image.src;
      }
    });
    Promise.all(promises).then(() => setCartImagesLoaded(true));
  });

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      {productsLoaded && cartImagesLoaded ? (
        <div>
          <h1>My cart</h1>
          {cart.value.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className={style["cart-container"]}>
              <div className={style["cart-item-container"]}>
                {cart.value.map(
                  (item, index) =>
                    cart &&
                    cartImages.value[item.imageId] &&
                    products.value[item.productId] && (
                      <div key={index} className={style["cart-item"]}>
                        <div className={style["cart-item-image-container"]}>
                          <img
                            src={cartImages.value[item.imageId]}
                            alt="Product"
                          />
                        </div>
                        <div className={style["cart-item-details-container"]}>
                          <p>
                            {products.value[item.productId]?.name.toString()}
                          </p>
                        </div>
                        <div className={style["cart-item-quantity-container"]}>
                          <button
                            onClick={() => subtractQuantity(item)}
                            className={style["quantity-button"]}
                          >
                            -
                          </button>
                          {item.quantity}
                          <button
                            onClick={() => {
                              addQuantity(item);
                            }}
                            className={style["quantity-button"]}
                          >
                            +
                          </button>
                        </div>
                        <div className={style["cart-item-actions-container"]}>
                          <PriceTag
                            price={products.value[
                              item.productId
                            ]?.price.toString()}
                            oldPrice={products.value[
                              item.productId
                            ]?.oldPrice.toString()}
                            size="medium"
                          />

                          <div
                            className={style["link"]}
                            onClick={() => deleteFromCart(item)}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className={style["cart-summary"]}>
                <div>Summary</div>
                <p>
                  Items costs:{" "}
                  {cart.value
                    .reduce((total, item) => {
                      return (
                        total +
                        parseFloat(
                          products.value[item.productId]?.price.toString()
                        ) *
                          item.quantity
                      );
                    }, 0)
                    .toFixed(2)}
                </p>
                <p>Shipping: {shippingCost.value} Lei</p>
                <div className={style["divider"]}></div>
                <div>
                  Total:{" "}
                  <div className={style["price-large"]}>
                    {(
                      cart.value.reduce((total, item) => {
                        return (
                          total +
                          parseFloat(
                            products.value[item.productId]?.price.toString()
                          ) *
                            item.quantity
                        );
                      }, 0) + parseFloat(shippingCost.value.toString())
                    ).toFixed(2)}{" "}
                    Lei
                  </div>
                </div>
                <button className={style["primary"]} onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};
