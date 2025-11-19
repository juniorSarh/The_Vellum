import { FaTrash } from "react-icons/fa";
import Button from "./Button";
import "../regUsers.css"

export interface ListCardProps {
  name: string;
  onDelete: () => void;
}

const RegUsers: React.FC<ListCardProps> = ({ name, onDelete }) => {
  return (
    <div className="userItem">
      <div className="innerUserItem">
        <p className="userName">{name}</p>
      </div>
      <Button
        icon={<FaTrash color=" #846D29" />}
        backgroundColor=" #e5e5e5"
        color="#fff"
        className="userdeletebtn"
        onClick={() => {
          onDelete();
        }}
      />
    </div>
  );
};

export default RegUsers;