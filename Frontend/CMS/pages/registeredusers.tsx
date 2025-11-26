import { useEffect, useState } from "react";
import SearchBar from "../../src/components/searchBar";
import RegUsers from "../../src/components/regUsers";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import { useNavigate } from "react-router-dom";
import "../../src/reservationPage.css";
import { FaArrowLeft } from "react-icons/fa";
import PrivatNav from "../../src/components/PrivatNav";
import { toast } from "react-toastify";

// Redux
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  fetchAllCustomers,
  deactivateCustomer,
} from "../../src/storeSlices/customerSlice";

const RegisteredUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((state) => state.customer);

  const navigate = useNavigate();

  // LOAD USERS ON PAGE LOAD
  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

const handleDeactivate = async (id: number) => {
  if (!window.confirm("Are you sure you want to deactivate this user?")) return;

  const result = await dispatch(deactivateCustomer(id));

  if (deactivateCustomer.fulfilled.match(result)) {
    toast.success("User deactivated successfully!");
  } else {
    toast.error("Failed to deactivate user");
  }
};

  const filteredUsers = customers.filter((c) =>
    `${c.first_name} ${c.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reservationPage">
      <div className="nav">
        <PrivatNav />
      </div>

      <div className="resBody">
        <div className="backButton">
          <Button
            name=""
            color="black"
            icon={<FaArrowLeft style={{ marginRight: "8px" }} />}
            onClick={() => navigate(-1)}
            className="back"
          />
        </div>

        <div className="SearchBar">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search..."
          />
        </div>

        <h2 className="Title">Registered Users</h2>

        <div className="List">
          {filteredUsers.map((user) => (
            <RegUsers
              key={user.id}
              name={`${user.first_name} ${user.last_name}`}
              onDelete={() => handleDeactivate(user.id!)}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisteredUsers;