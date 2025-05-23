import React from "react";
import { Product } from "../../components";
import { useParams } from "react-router-dom";
import { getProduct } from "../../services";
import { setAlert } from "../../states";
import { Signal, useSignal, useSignalEffect } from "@preact/signals-react";
import { IProduct } from "../../types";
import { useSignals } from "@preact/signals-react/runtime";

export const ProductController: React.FC = () => {
  useSignals();
  const { id } = useParams();

  const product: Signal<IProduct | undefined> = useSignal(undefined);

  const setProduct = (newProduct: IProduct) => {
    product.value = newProduct;
  };

  useSignalEffect(() => {
    if (id) {
      getProduct(parseInt(id), setAlert, setProduct);
    }
  });

  return product.value && <Product product={product.value} />;
};
