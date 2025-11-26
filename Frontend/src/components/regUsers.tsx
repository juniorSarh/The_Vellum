import { FaTrash, FaCheck } from "react-icons/fa";
import Button from "./Button";
import "../regUsers.css";

export interface ListCardProps {
  name: string;
  isActive?: boolean;
  onDelete: () => void; // activate/deactivate
}

const RegUsers: React.FC<ListCardProps> = ({
  name,
  isActive = true,
  onDelete,
}) => {
  return (
    <div className="userItem">
      <div className="innerUserItem">
        <p
          className="userName"
          style={{ textDecoration: isActive ? "none" : "line-through" }}
        >
          {name}
        </p>
      </div>

      <Button
        icon={
          isActive ? <FaTrash color="#846D29" /> : <FaCheck color="#28a745" />
        }
        backgroundColor="#e5e5e5"
        color="#fff"
        className="userdeletebtn"
        onClick={onDelete}
      />
    </div>
  );
};

export default RegUsers;