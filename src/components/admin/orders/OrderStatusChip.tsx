import { OrderStatus } from "../../../types";
import style from "./OrderStatusChip.module.scss";

export const OrderStatusChip = ({ status }: { status: OrderStatus }) => {
  const getStatusColor = () => {
    switch (status) {
      case OrderStatus.PENDING:
        return "yellow";
      case OrderStatus.PROCESSING:
        return "blue";
      case OrderStatus.SHIPPED:
        return "green";
      case OrderStatus.COMPLETED:
        return "dark-green";
      case OrderStatus.CANCELLED:
        return "dark-red";
    }
  };

  return (
    <div className={`${style["chip"]} ${style[getStatusColor()]}`}>
      {status}
    </div>
  );
};
