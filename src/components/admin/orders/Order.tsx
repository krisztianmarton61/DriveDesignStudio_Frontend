import { useSignals } from "@preact/signals-react/runtime";
import { IOrder } from "../../../types";
import style from "./Order.module.scss";
import { OrderStatusChip } from "./OrderStatusChip";

export const Order = ({ order }: { order: IOrder }) => {
  useSignals();
  const openImageInNewTab = (imageId: string) => {
    const base64Image = imageId;
    const imageUrl = `data:image/png;base64,${base64Image}`;
    window.open(imageUrl, "_blank");
  };

  return (
    <div className={style["order-container"]}>
      <h1>Order</h1>

      <div className={style["order-information"]}>
        <h2>Basic Information</h2>
        <div className={style["order-information-basic"]}>
          <div>Order Id: {order.id}</div>
          <div>
            Timestamp:{" "}
            {new Date(parseInt(order.timestamp as string))
              .toLocaleString()
              .replace(" ", "")
              .replace(" ", "")}
          </div>
          {order.status && <OrderStatusChip status={order.status} />}
        </div>
        <div className={style["order-information-billing-shipping-container"]}>
          <div>
            <h2>Billing Information</h2>
            <div className={style["order-information-billing-shipping"]}>
              <div className={style["order-information-billing-shipping-item"]}>
                <div>First name: {order.billingInformation.firstName}</div>
                <div>Last name: {order.billingInformation.lastName}</div>
                <div>Email: {order.email}</div>
                <div>Phone: {order.billingInformation.phone}</div>
              </div>
              <div className={style["order-information-billing-shipping-item"]}>
                <div>{order.billingInformation.address}</div>
                <div>{order.billingInformation.city}</div>
                <div>{order.billingInformation.county}</div>
                <div>{order.billingInformation.country}</div>
              </div>
            </div>
          </div>
          <div>
            <h2>Shipping information</h2>
            {order.shippingInformation ? (
              <>
                <div className={style["order-information-billing-shipping"]}>
                  <div
                    className={style["order-information-billing-shipping-item"]}
                  >
                    <div>First name: {order.shippingInformation.firstName}</div>
                    <div>Last name: {order.shippingInformation.lastName}</div>
                    <div>Email: {order.email}</div>
                    <div>Phone: {order.shippingInformation.phone}</div>
                  </div>
                  <div
                    className={style["order-information-billing-shipping-item"]}
                  >
                    <div>{order.shippingInformation.address}</div>
                    <div>{order.shippingInformation.city}</div>
                    <div>{order.shippingInformation.county}</div>
                    <div>{order.shippingInformation.country}</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={style["order-information-billing-shipping"]}>
                  <div
                    className={style["order-information-billing-shipping-item"]}
                  >
                    <div>First name: {order.billingInformation.firstName}</div>
                    <div>Last name: {order.billingInformation.lastName}</div>
                    <div>Email: {order.email}</div>
                    <div>Phone: {order.billingInformation.phone}</div>
                  </div>
                  <div
                    className={style["order-information-billing-shipping-item"]}
                  >
                    <div>{order.billingInformation.address}</div>
                    <div>{order.billingInformation.city}</div>
                    <div>{order.billingInformation.county}</div>
                    <div>{order.billingInformation.country}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <h2>Products</h2>
        <div className={style["table-container"]}>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product) => (
                <tr>
                  <td>{product.productId}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <div
                      className={style["link"]}
                      onClick={() => {
                        openImageInNewTab(product.imageId);
                      }}
                    >
                      {product.imageId}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={style["order-products"]}></div>
    </div>
  );
};
