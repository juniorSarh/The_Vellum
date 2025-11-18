import React from "react";
import Button from "./Button";
import "../assets/css/table.css";


interface Booking {
  guest: string;
  hotel: string;
  checkin: string;
  checkout: string;
  status: string;
}

interface TableProps {
  title?: string;
  data: Booking[];
}

export default function Table({ title, data }: TableProps) {
  return (
    <div className="table-wrapper">
      {title && <h2 className="table-title">{title}</h2>}

      <table className="custom-table">
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Hotel</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Payment Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((booking, index) => (
            <tr key={index}>
              <td>{booking.guest}</td>
              <td>{booking.hotel}</td>
              <td>{booking.checkin}</td>
              <td>{booking.checkout}</td>
              <td>{booking.status}</td>
              <td>
                <Button
                  name="View details"
                  backgroundColor="#846d29"
                  color="#000"
                  className="table-btn"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
