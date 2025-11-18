import React from "react";
import "./listCard.css";
import Button from "./Button";
import { FaTrash } from "react-icons/fa";


export interface ListCardProps {
  username: string;
  onDelete: () => void;
}

const ListCard: React.FC<ListCardProps> = ({ username, onDelete }) => {
  return (
    <div className="user-item">
      <div className="inner-user-item">
        <p className="user-name">{username}</p>
      </div>
      <Button
        icon={<FaTrash color=" #846D29" />}
        backgroundColor=" #555151"
        color="#fff"
        className="user-delete-btn"
        onClick={() => {onDelete();}}
      />
    </div>
  );
};

export default ListCard;
