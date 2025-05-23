import React from "react";
import style from "./HeaderItem.module.scss";

interface HeaderItemProps {
  label?: string;
  onClick?: () => void;
  Icon: React.ComponentType<{ className: string }>;
}

export const HeaderItem: React.FC<HeaderItemProps> = ({ onClick, Icon }) => {
  return (
    <div className={style["header-item"]} onClick={onClick}>
      <Icon className={style["header-item-icon"]} />
    </div>
  );
};
