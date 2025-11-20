import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import { Link } from "react-router-dom";
import StatCard from "../../src/components/statCard";
import Table from "../../src/components/Table";
import "../../src/dashboardPage.css"
import {
  FaHome,
  FaMoneyBillWave,
  FaClipboardList,
  FaHotel,
} from "react-icons/fa";

const bookings = [
  {
    guest: "yjuy",
    hotel: "8uyi",
    checkin: "2025-11-20",
    checkout: "2025-11-25",
    status: "Paid",
  },
  {
    guest: "tfuhy",
    hotel: "tutru",
    checkin: "2025-12-01",
    checkout: "2025-12-05",
    status: "Pending",
  },
];

export default function hoteldetails() {
  return (
    <div>
      <div className="nav">
        <PrivatNav />
      </div>

      <div className="dash">
        <div className="btns">
          <Link to="/reservations" className="link-reset">
            <Button
              name="Resevations"
              color="white"
              backgroundColor="black"
              className="dashbtn"
            />
          </Link>

          <Link to="/registered-users" className="link-reset">
            <Button
              name="Users"
              color="white"
              backgroundColor="black"
              className="dashbtn"
            />
          </Link>

          <Link to="/add-admin" className="link-reset">
            <Button
              name="Add Admin"
              color="white"
              backgroundColor="black"
              className="dashbtn"
            />
          </Link>

          <Link to="/add-hotel" className="link-reset">
            <Button
              name="Add Hotels"
              color="white"
              backgroundColor="black"
              className="dashbtn"
            />
          </Link>
        </div>

        <div>
          <div className="cards" style={{ display: "flex", gap: "20px" }}>
            <StatCard title="Occupancy rate" value="87%" icon={<FaHome />} />
            <StatCard
              title="Successful payments"
              value="92%"
              icon={<FaMoneyBillWave />}
            />
            <StatCard
              title="Total reservations"
              value="75%"
              icon={<FaClipboardList />}
            />
            <StatCard title="Total hotels" value="100%" icon={<FaHotel />} />
          </div>
        </div>

        <div className="tablee">
          <h2>Latest Bookings</h2>
          <Table data={bookings} />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
