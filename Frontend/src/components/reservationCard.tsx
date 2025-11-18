import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "./Button";
import "./reservationCard.css"

export interface ListCardProps {
  username: string;
  onDelete: () => void;
}

const ReservationCard: React.FC<ListCardProps> = ({ username, onDelete }) => {
  return (
    <div className="reservation-item">
      <div className="inner-reservation-item">
        <p className="reservation-name">{username}</p>
      </div>
      <Button
        icon={<FaEdit color=" #846D29" />}
        backgroundColor=" #555151"
        color="#fff"
        className="reservation-edit-btn"
        onClick={() => {onDelete();}}
      />
      <Button
        icon={<FaTrash color=" #846D29" />}
        backgroundColor=" #555151"
        color="#fff"
        className="reservation-delete-btn"
        onClick={() => {onDelete();}}
      />
      
    </div>
  );
};

export default ReservationCard;