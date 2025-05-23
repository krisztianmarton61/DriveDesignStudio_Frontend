import { Signal, computed, effect, signal } from "@preact/signals-react";
import { IProduct } from "../types";

export const resetCartState = () => {
  cart.value = [];
};

const getCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  return [];
};

export const cartImages: Signal<{ [id: string]: string }> = signal({});

export const cart: Signal<
  { productId: number; imageId: string; quantity: number }[]
> = signal(getCartFromLocalStorage());

export const setCart = (
  newCart: { productId: number; imageId: string; quantity: number }[]
) => {
  cart.value = newCart;
};

export const addToCart = ({
  productId,
  imageId,
  quantity,
}: {
  productId: number;
  imageId: string;
  quantity?: number;
}) => {
  cart.value = [...cart.value, { productId, imageId, quantity: quantity || 1 }];
};

export const deleteFromCart = ({
  productId,
  imageId,
}: {
  productId: number;
  imageId: string;
}) => {
  cart.value = cart.value.filter(
    (item) => item.productId !== productId || item.imageId !== imageId
  );
};

export const addQuantity = ({
  productId,
  imageId,
}: {
  productId: number;
  imageId: string;
}) => {
  const index = cart.value.findIndex(
    (item) => item.productId === productId && item.imageId === imageId
  );

  if (index !== -1) {
    cart.value[index].quantity++;
    cart.value = [...cart.value];
  }
};

export const subtractQuantity = ({
  productId,
  imageId,
}: {
  productId: number;
  imageId: string;
}) => {
  const index = cart.value.findIndex(
    (item) => item.productId === productId && item.imageId === imageId
  );
  if (index !== -1) {
    cart.value[index].quantity--;
    cart.value = [...cart.value];
    if (cart.value[index].quantity === 0) {
      deleteFromCart({ productId, imageId });
    }
  }
};

export const cartCount = computed(() => cart.value.length);

effect(() => {
  localStorage.setItem("cart", JSON.stringify(cart.value));
});

export const products: Signal<{ [id: string]: IProduct }[]> = signal([]);

export const setProduct = (product: IProduct) => {
  products.value = { ...products.value, [product.id.toString()]: product };
};
