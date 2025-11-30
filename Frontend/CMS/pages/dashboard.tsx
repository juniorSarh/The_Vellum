// src/pages/DashboardPage.tsx
import { useEffect, useMemo, useState } from "react";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import { Link } from "react-router-dom";
import StatCard from "../../src/components/statCard";
import Table from "../../src/components/Table";
import "../../src/dashboardPage.css";
import {
  FaHome,
  FaMoneyBillWave,
  FaClipboardList,
  FaHotel,
} from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  fetchBookings,
  type Booking,
} from "../../src/storeSlices/bookingSlice";
import SearchBar from "../../src/components/searchBar";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const { bookings, loading, error } = useAppSelector((state) => state.booking);
  const hotels = useAppSelector((state: any) => state.hotel?.hotels || []);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const {
    latestBookingsForTable,
    totalReservations,
    successRate,
    occupancyRate,
    totalHotels,
  } = useMemo(() => {
    if (!bookings || bookings.length === 0) {
      return {
        latestBookingsForTable: [],
        totalReservations: 0,
        successRate: "0%",
        occupancyRate: "0%",
        totalHotels: Array.isArray(hotels) ? hotels.length : 0,
      };
    }

    const total = bookings.length;

    const successStatuses = ["paid", "confirmed", "completed"];
    const activeStatuses = ["paid", "confirmed", "completed", "pending"];

    const successfulCount = bookings.filter((b) =>
      successStatuses.includes(b.status.toLowerCase())
    ).length;

    const activeCount = bookings.filter((b) =>
      activeStatuses.includes(b.status.toLowerCase())
    ).length;

    const successRateNum =
      total > 0 ? Math.round((successfulCount / total) * 100) : 0;
    const occupancyRateNum =
      total > 0 ? Math.round((activeCount / total) * 100) : 0;

    const sorted = [...bookings].sort((a: Booking, b: Booking) => {
      const aDate = new Date(a.check_in_date).getTime();
      const bDate = new Date(b.check_in_date).getTime();
      return bDate - aDate;
    });

    const top15 = sorted.slice(0, 15);

    const dataForTable = top15.map((b) => {
      const guestName =
        `${b.customer_first_name ?? ""} ${b.customer_last_name ?? ""}`.trim() ||
        `Customer #${b.customer_id}`;

      const hotelName = b.hotel_name || `Room #${b.room_id}`;

      return {
        guest: guestName,
        hotel: hotelName,
        checkin: b.check_in_date,
        checkout: b.check_out_date,
        status: b.status,
      };
    });

    return {
      latestBookingsForTable: dataForTable,
      totalReservations: total,
      successRate: `${successRateNum}%`,
      occupancyRate: `${occupancyRateNum}%`,
      totalHotels: Array.isArray(hotels) ? hotels.length : 0,
    };
  }, [bookings, hotels]);

  // ✅ FILTER BOOKINGS USING SEARCH TERM
  const filteredBookings = latestBookingsForTable.filter(
    (b) =>
      b.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="nav">
        <PrivatNav />
      </div>

      <div className="dash">
        {/* Top buttons */}
        <div className="btns">
          <SearchBar
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

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

        {/* Stat cards */}
        <div>
          <div className="cards" style={{ display: "flex", gap: "20px" }}>
            <StatCard
              title="Occupancy rate"
              value={occupancyRate}
              icon={<FaHome />}
            />
            <StatCard
              title="Successful payments"
              value={successRate}
              icon={<FaMoneyBillWave />}
            />
            <StatCard
              title="Total reservations"
              value={totalReservations.toString()}
              icon={<FaClipboardList />}
            />
            <StatCard
              title="Total hotels"
              value={totalHotels.toString()}
              icon={<FaHotel />}
            />
          </div>
        </div>

        {/* Latest bookings table */}
        <div className="tablee">
          <h2>Latest Bookings</h2>

          {loading && <p>Loading latest bookings...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && filteredBookings.length > 0 && (
            <Table data={filteredBookings} />
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <p>No results match your search.</p>
          )}
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
