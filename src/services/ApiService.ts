import axios from "axios";
import { config } from "../config";
import { Alert, AlertType } from "../states";
import { IProduct, IImage, IOrder } from "../types";
import { fetchAuthSession } from "aws-amplify/auth";

const getAccessToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.accessToken;
};

export const generateImage = async (
  params: {
    prompt: string;
    style?: string;
  },
  setIsLoading: (isLoading: boolean) => void,
  setImage: (img: string) => void,
  setAlert: (alert: Alert) => void
) => {
  setIsLoading(true);
  await axios
    .get(config.api.invokeUrl + "generate", {
      params: {
        prompt: params.prompt,
        style: params.style,
      },
      timeout: 120000,
    })
    .then((res) => {
      setImage(res.data);
    })
    .catch((err) => {
      setAlert({
        type: AlertType.Error,
        message: err.message,
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
};

export const getImage = async (
  setAlert: (alert: Alert) => void,
  id: string
): Promise<{ id: string; src: string }> => {
  const image = await axios
    .get(config.api.invokeUrl + "images", {
      params: { id },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      setAlert({
        type: AlertType.Error,
        message: err.message,
      });
    });

  return { id, src: image };
};

export const postImage = async (
  image: string,
  setIsLoading: (isLoading: boolean) => void,
  setAlert: (alert: Alert) => void
): Promise<string> => {
  setIsLoading(true);
  const imageId = await axios
    .post(config.api.invokeUrl + "images", image.slice(22))
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      setAlert({
        type: AlertType.Error,
        message: err.message,
      });
      return "";
    })
    .finally(() => {
      setIsLoading(false);
    });

  return imageId;
};

export const removeBackground = async (
  image: string,
  setIsLoading: (isLoading: boolean) => void,
  setAlert: (alert: Alert) => void
): Promise<string> => {
  setIsLoading(true);
  const newImage = await axios
    .post(config.api.invokeUrl + "background", image.slice(22))
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      setAlert({
        type: AlertType.Error,
        message: err.message,
      });
      return "";
    })
    .finally(() => {
      setIsLoading(false);
    });

  return newImage;
};

export const getImagesData = async (
  setImages: (images: IImage[]) => void,
  setIsLoading?: (isLoading: boolean) => void,
  setLastEvaluatedKey?: (lastEvaluatedKey: string) => void,
  setAlert?: (alert: Alert) => void,
  query?: {
    exclusiveStartKey?: string;
    limit?: number;
  }
) => {
  if (setIsLoading) setIsLoading(true);
  await axios
    .get(config.api.invokeUrl + "images", { params: { ...query } })
    .then((res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = res.data.items.map((image: any) => {
        return {
          id: image.id.S,
          createdAt: image.createdAt.S,
          prompt: image.prompt.S,
          buyCounter: parseInt(image.buyCounter.N),
          favoriteCounter: parseInt(image.favoriteCounter.N),
        };
      });
      if (setLastEvaluatedKey)
        setLastEvaluatedKey(res.data.lastEvaluatedKey?.id?.S || undefined);
      setImages(data);
    })
    .catch((err) => {
      if (setAlert)
        setAlert({
          type: AlertType.Error,
          message: err.message,
        });
    })
    .finally(() => {
      if (setIsLoading) setIsLoading(false);
    });
};

export const getProduct = async (
  id: number,
  setAlert: (alert: Alert) => void,
  setProduct: (product: IProduct) => void
) => {
  await axios
    .get(config.api.invokeUrl + "products", {
      params: { id },
    })
    .then((res) => {
      const product = {
        id: res.data.id.S,
        name: res.data.name.S,
        description: res.data.description.S,
        price: res.data.price.N,
        oldPrice: res.data.oldPrice.N,
      };
      setProduct(product);
    })
    .catch((err) => {
      setAlert({
        type: AlertType.Error,
        message: err.message,
      });
    });
};

export const postOrder = async (
  order: IOrder,
  setOrderId: (orderId: string) => void,
  setOrderPosted: (orderPosted: boolean) => void,
  setAlert: (alert: Alert) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  setIsLoading(true);
  await axios
    .post(config.api.invokeUrl + "orders", order)
    .then((res) => {
      setOrderId(res.data);
      setAlert({
        type: AlertType.Success,
        message: "Order placed successfully",
      });
    })
    .catch((err) => {
      setOrderId("");
      setAlert({
        type: AlertType.Error,
        message: err.message,
      });
    })
    .finally(() => {
      setOrderPosted(true);
      setIsLoading(false);
    });
};
export const getOrders = async (
  setAlert: (alert: Alert) => void,
  setOrders: (orders: IOrder[]) => void,
  params?: {
    exclusiveStartKey?: string;
    limit?: number;
  }
) => {
  const accessToken = await getAccessToken();
  const url = config.api.invokeUrl + "orders";
  await axios
    .get(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      const orders: IOrder[] = res.data.map((order: IOrder) => {
        return {
          id: order.id,
          timestamp: order.timestamp,
          status: order.status,
        };
      });
      setOrders(orders);
    })
    .catch((err) => {
      setAlert({
        type: AlertType.Error,
        message: err.message,
      });
    });
};

export const getOrderById = async (
  id: string,
  setAlert: (alert: Alert) => void,
  setOrder: (orders: IOrder) => void
) => {
  const url = config.api.invokeUrl + "orders/" + id;
  await axios
    .get(url)
    .then((res) => {
      const order: IOrder = {
        id: res.data.id,
        timestamp: res.data.timestamp,
        status: res.data.status,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products: res.data.products.map((product: any) => {
          return {
            productId: product.M.productId.S,
            quantity: product.M.quantity.N,
            imageId: product.M.imageId.S,
          };
        }),
        email: res.data.email,
        billingInformation: {
          firstName: res.data.billingInformation.firstName.S,
          lastName: res.data.billingInformation.lastName.S,
          phone: res.data.billingInformation.phone.S,
          address: res.data.billingInformation.address.S,
          city: res.data.billingInformation.city.S,
          county: res.data.billingInformation.county.S,
          country: res.data.billingInformation.country.S,
        },
        shippingInformation:
          res.data.shippingInformation.firstName !== undefined
            ? {
                firstName: res.data.shippingInformation.firstName.S,
                lastName: res.data.shippingInformation.lastName.S,
                phone: res.data.shippingInformation.phone.S,
                address: res.data.shippingInformation.address.S,
                city: res.data.shippingInformation.city.S,
                county: res.data.shippingInformation.county.S,
                country: res.data.shippingInformation.country.S,
              }
            : undefined,
      };
      setOrder(order);
    })
    .catch((err) => {
      setAlert({
        type: AlertType.Error,
        message: err.message,
      });
    });
};
