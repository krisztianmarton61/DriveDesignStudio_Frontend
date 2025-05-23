import { useNavigate } from "react-router-dom";
import { IOrder } from "../../../types";
import style from "./OrdersList.module.scss";
import { OrderStatusChip } from "./OrderStatusChip";

export const OrdersList = ({ orders }: { orders: IOrder[] }) => {
  const navigate = useNavigate();

  const handleOrderClick = (order: IOrder) => {
    navigate(`/admin/orders/${order.id}`);
  };

  return (
    <>
      <div className={style["table-container"]}>
        <h1>Order List</h1>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <div
                    className={style["link"]}
                    onClick={() => handleOrderClick(order)}
                  >
                    {order.id}
                  </div>
                </td>
                <td>
                  {new Date(parseInt(order.timestamp as string))
                    .toLocaleString()
                    .replace(" ", "")
                    .replace(" ", "")}
                </td>
                <td>
                  {order.status && <OrderStatusChip status={order.status} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
