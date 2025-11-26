import { useState, useEffect } from "react";
import SearchBar from "../../src/components/searchBar";
import RegUsers from "../../src/components/regUsers";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import { useNavigate } from "react-router-dom";
import "../../src/reservationPage.css";
import { FaArrowLeft } from "react-icons/fa";
import PrivatNav from "../../src/components/PrivatNav";

interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
}

const RegisteredUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Fetch registered customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:4040/api/customers");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load customers");
        }

        setCustomers(data);
      } catch (err: unknown) {
        console.error("Failed to load customers:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("Failed to load customers");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Deactivate (soft delete) customer
  const handleDeleteCustomer = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to deactivate this user?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:4040/api/customers/${id}/deactivate`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to deactivate customer");
      }

      // Remove from list (or you could just mark as inactive)
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      console.error("Failed to deactivate customer:", err);

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Failed to deactivate customer";

      alert(message);
    }
  };

  // Filter customers by search term (name or email)
  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
    const email = c.email.toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });

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
            onClick={handleBack}
            className="back"
          />
        </div>

        <div className="SearchBar">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
          />
        </div>

        <h2 className="Title">Registered Users</h2>

        {loading && <p className="status-text">Loading users...</p>}
        {error && <p className="status-text error-text">{error}</p>}

        <div className="List">
          {filteredCustomers.length === 0 && !loading ? (
            <p style={{ textAlign: "center", width: "100%" }}>
              No registered users found.
            </p>
          ) : (
            filteredCustomers.map((customer) => (
              <RegUsers
                key={customer.id}
                name={`${customer.first_name} ${customer.last_name} - ${customer.email}`}
                onDelete={() => handleDeleteCustomer(customer.id)}
              />
            ))
          )}
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default RegisteredUsers;
