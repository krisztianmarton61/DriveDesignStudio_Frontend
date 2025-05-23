import { OrderConfirmation } from "../components";
import style from "../styles/Page.module.scss";

export const OrderConfirmationPage: React.FC = () => {
  return (
    <div className={style["page"]}>
      <OrderConfirmation />
    </div>
  );
};
