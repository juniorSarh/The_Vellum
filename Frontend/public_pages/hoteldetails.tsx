// // import { useEffect } from "react";
// // import NavBar from "../src/components/navBar";
// // import Button from "../src/components/Button";
// // import Footer from "../src/components/Footer";
// // import {
// //   FaArrowLeft,
// //   FaRegHeart,
// //   FaShare,
// //   FaMapMarkerAlt,
// // } from "react-icons/fa";
// // import "../src/assets/css/hotelDetails.css";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
// // import { getHotelById } from "../src/storeSlices/hotelSlice";
// // import "../src/assets/css/hotelDetails.css";
// // // import hotelImage from '../assets/hotel.jpg'

// // export default function HotelDetails() {
// //   const { id } = useParams(); // /hotel/:id
// //   const navigate = useNavigate();
// //   const dispatch = useAppDispatch();

// //   const { hotels, loading, error } = useAppSelector((state) => state.hotel);

// //   const hotel = hotels.length > 0 ? hotels[0] : null;

// //   // Fetch selected hotel
// //   useEffect(() => {
// //     if (id) {
// //       dispatch(getHotelById(Number(id)));
// //     }
// //   }, [dispatch, id]);

// //   if (loading) return <p className="loading">Loading hotel...</p>;
// //   if (error) return <p className="error">{error}</p>;
// //   if (!hotel) return <p>No hotel found.</p>;

// //   return (
// //     <div className="hotel-details-page">
// //       {/* NAV */}
// //       <div className="nav-row">
// //         <NavBar />
// //       </div>

// //       {/* MAIN WRAPPER */}
// //       <div className="hotel-details-wrapper">
// //         {/* LEFT COLUMN */}
// //         <div className="hotel-left">
// //           <Button
// //             icon={<FaArrowLeft />}
// //             backgroundColor="white"
// //             color="black"
// //             onClick={() => navigate(-1)}
// //           />

// //           <h1 className="hotel-title">{hotel.name}</h1>
// //           <p className="hotel-location">{hotel.location}</p>

// //           <div className="image-container">
// //             {hotel.images && hotel.images.length > 0 ? (
// //               <img
// //                 src={
// //                   hotel.images[0].startsWith("http")
// //                     ? hotel.images[0]
// //                     : `http://localhost:4040/${hotel.images[0]}`
// //                 }
// //                 alt={hotel.name}
// //               />
// //             ) : (
// //               <p>No image available</p>
// //             )}
// //           </div>

// //           <h2 className="desc-title">Description:</h2>

// //           <p className="hotel-description">
// //             {hotel.description || "No description available."}
// //           </p>
// //         </div>

// //         {/* RIGHT COLUMN */}
// //         <div className="hotel-right">
// //           <div className="right-top-actions">
// //             <Button
// //               icon={<FaRegHeart />}
// //               className="icon"
// //               backgroundColor="white"
// //               color="black"
// //             />
// //             <Button
// //               icon={<FaShare />}
// //               className="icon"
// //               backgroundColor="white"
// //               color="black"
// //             />

// //             <Button
// //               name="Book Now"
// //               backgroundColor="#000"
// //               color="white"
// //               className="book-btn"
// //               onClick={() => navigate(`/checkout/${hotel.hotel_id}`)}
// //             />
// //           </div>

// //           {/* REVIEWS (STATIC FOR NOW) */}
// //           <div className="review-panel">
// //             <p>
// //               <strong>Total Good reviews:</strong> 320
// //             </p>
// //             <p>
// //               <strong>Comments:</strong>
// //             </p>

// //             <div className="review-item">
// //               • Amazing place, loved the environment.
// //             </div>
// //             <div className="review-item">• Very clean and peaceful stay.</div>
// //             <div className="review-item">
// //               • Staff were friendly and helpful.
// //             </div>
// //           </div>

// //           {/* MAP BUTTON */}
// //           <div className="map-button-box">
// //             <Button
// //               icon={<FaMapMarkerAlt />}
// //               name="Show on Map"
// //               backgroundColor="#e5e5e5"
// //               color="black"
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* FOOTER */}
// //       <div className="footer">
// //         <Footer />
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import NavBar from "../src/components/navBar";
// import Button from "../src/components/Button";
// import Footer from "../src/components/Footer";
// import {
//   FaArrowLeft,
//   FaRegHeart,
//   FaShare,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import "../src/assets/css/hotelDetails.css";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
// import { getHotelById } from "../src/storeSlices/hotelSlice";

// // 🟢 ROOM SLICE
// import { fetchRooms } from "../src/storeSlices/roomSlice";

// // 🟢 INPUT COMPONENT
// import Input from "../src/components/input";

// export default function HotelDetails() {
//   const { id } = useParams(); // /hotel/:id
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { hotels, loading, error } = useAppSelector((state) => state.hotel);
//   const { rooms } = useAppSelector((state) => state.room);

//   const hotel = hotels.length > 0 ? hotels[0] : null;

//   // -------------------
//   //   FORM STATE
//   // -------------------
//   const [reservation, setReservation] = useState({
//     room_type: "",
//     check_in_date: "",
//     check_out_date: "",
//     people: "",
//   });

//   // -------------------
//   //   ROOM TYPE PRICES
//   // -------------------
//   const getPriceForRoomType = (type: string) => {
//     const room = rooms.find(
//       (r) => r.room_type.toLowerCase() === type.toLowerCase()
//     );
//     return room ? room.price : 0;
//   };

//   // -------------------
//   //   HANDLER
//   // -------------------
//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setReservation((prev) => ({ ...prev, [name]: value }));
//   };

//   // -------------------------
//   // FETCH hotel & rooms
//   // -------------------------
//   useEffect(() => {
//     if (id) {
//       dispatch(getHotelById(Number(id)));
//       dispatch(fetchRooms({ hotelId: Number(id) }));
//     }
//   }, [dispatch, id]);

//   if (loading) return <p className="loading">Loading hotel...</p>;
//   if (error) return <p className="error">{error}</p>;
//   if (!hotel) return <p>No hotel found.</p>;

//   return (
//     <div className="hotel-details-page">
//       {/* NAV */}
//       <div className="nav-row">
//         <NavBar />
//       </div>

//       {/* MAIN WRAPPER */}
//       <div className="hotel-details-wrapper">
//         {/* LEFT COLUMN */}
//         <div className="hotel-left">
//           <Button
//             icon={<FaArrowLeft />}
//             backgroundColor="white"
//             color="black"
//             onClick={() => navigate(-1)}
//           />

//           <h1 className="hotel-title">{hotel.name}</h1>
//           <p className="hotel-location">{hotel.location}</p>

//           <div className="image-container">
//             {hotel.images && hotel.images.length > 0 ? (
//               <img
//                 src={
//                   hotel.images[0].startsWith("http")
//                     ? hotel.images[0]
//                     : `http://localhost:4040/${hotel.images[0]}`
//                 }
//                 alt={hotel.name}
//               />
//             ) : (
//               <p>No image available</p>
//             )}
//           </div>

//           <h2 className="desc-title">Description:</h2>

//           <p className="hotel-description">
//             {hotel.description || "No description available."}
//           </p>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="hotel-right">
//           <div className="right-top-actions">
//             <Button
//               icon={<FaRegHeart />}
//               className="icon"
//               backgroundColor="white"
//               color="black"
//             />
//             <Button
//               icon={<FaShare />}
//               className="icon"
//               backgroundColor="white"
//               color="black"
//             />

//             <Button
//               name="Book Now"
//               backgroundColor="#000"
//               color="white"
//               className="book-btn"
//               onClick={() => navigate(`/checkout/${hotel.hotel_id}`)}
//             />
//           </div>

//           {/* REVIEWS */}
//           <div className="review-panel">
//             <p>
//               <strong>Total Reviews:</strong> 320
//             </p>
//             <p>
//               <strong>Comments:</strong>
//             </p>

//             <div className="review-item">
//               • Amazing place, loved the environment.
//             </div>
//             <div className="review-item">• Very clean and peaceful stay.</div>
//             <div className="review-item">
//               • Staff were friendly and helpful.
//             </div>
//           </div>

//           {/* MAP */}
//           <div className="map-button-box">
//             <Button
//               icon={<FaMapMarkerAlt />}
//               name="Show on Map"
//               backgroundColor="#e5e5e5"
//               color="black"
//             />
//           </div>
//         </div>
//       </div>

//       {/* RESERVATION FORM */}
//       <div className="reservation-container">
//         <h2>Make a Reservation</h2>

//         <div className="reservation-form">
//           {/* Room type */}
//           <div className="form-group">
//             <label>Room Type</label>
//             <select
//               name="room_type"
//               value={reservation.room_type}
//               onChange={handleChange}
//             >
//               <option value="">Select room type</option>
//               <option value="Deluxe">
//                 Deluxe - R{getPriceForRoomType("Deluxe")}
//               </option>
//               <option value="Standard">
//                 Standard - R{getPriceForRoomType("Standard")}
//               </option>
//               <option value="Suite">
//                 Suite - R{getPriceForRoomType("Suite")}
//               </option>
//             </select>
//           </div>

//           {/* Dates */}
//           <Input
//             label="Check-in Date"
//             type="date"
//             name="check_in_date"
//             value={reservation.check_in_date}
//             onChange={handleChange}
//           />

//           <Input
//             label="Check-out Date"
//             type="date"
//             name="check_out_date"
//             value={reservation.check_out_date}
//             onChange={handleChange}
//           />

//           {/* People */}
//           <Input
//             label="Number of People"
//             type="number"
//             name="people"
//             value={reservation.people}
//             onChange={handleChange}
//           />

//           {/* BUTTON */}
//           <Button
//             name="Reserve"
//             backgroundColor="#846d29"
//             color="white"
//             className="reserve-btn"
//             onClick={() =>
//               navigate(`/checkout/${hotel.hotel_id}`, {
//                 state: reservation,
//               })
//             }
//           />
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="footer">
//         <Footer />
//       </div>
//     </div>
//   );
// }











import { useEffect, useState } from "react";
import NavBar from "../src/components/navBar";
import Button from "../src/components/Button";
import Footer from "../src/components/Footer";
import {
  FaArrowLeft,
  FaRegHeart,
  FaShare,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../src/assets/css/hotelDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { getHotelById } from "../src/storeSlices/hotelSlice";

// Rooms slice
import { fetchRooms } from "../src/storeSlices/roomSlice";

// Input
import Input from "../src/components/input";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { hotels, loading, error } = useAppSelector((state) => state.hotel);
  const { rooms } = useAppSelector((state) => state.room);

  const hotel = hotels.find((h) => h.hotel_id === Number(id)) || null;


  // FORM STATE
  const [reservation, setReservation] = useState({
    room_type: "",
    check_in_date: "",
    check_out_date: "",
    people: "",
  });

  // ROOM PRICE BASED ON TYPE
  const getPriceForRoomType = (type: string) => {
    const room = rooms.find(
      (r) => r.room_type.toLowerCase() === type.toLowerCase()
    );
    return room ? room.price : 0;
  };

  // TOTAL PRICE CALCULATION
  const calculateTotalPrice = () => {
    if (
      !reservation.room_type ||
      !reservation.check_in_date ||
      !reservation.check_out_date
    ) {
      return 0;
    }

    const pricePerNight = getPriceForRoomType(reservation.room_type);

    const checkIn = new Date(reservation.check_in_date);
    const checkOut = new Date(reservation.check_out_date);

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (numDays <= 0) return 0;

    return pricePerNight * numDays;
  };

  const totalPrice = calculateTotalPrice();

  // FORM HANDLER
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  // FETCH ROOMS + HOTEL
  useEffect(() => {
    if (id) {
      dispatch(getHotelById(Number(id)));
      dispatch(fetchRooms({ hotelId: Number(id) }));
    }
  }, [dispatch, id]);

  if (loading) return <p className="loading">Loading hotel...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!hotel) return <p>No hotel found.</p>;

  return (
    <div className="hotel-details-page">
      {/* NAV */}
      <div className="nav-row">
        <NavBar />
      </div>

      {/* MAIN */}
      <div className="hotel-details-wrapper">
        <div className="hotel-left">
          <Button
            icon={<FaArrowLeft />}
            backgroundColor="white"
            color="black"
            onClick={() => navigate(-1)}
          />

          <h1 className="hotel-title">{hotel.name}</h1>
          <p className="hotel-location">{hotel.location}</p>

          <div className="image-container">
            {hotel.images && hotel.images.length > 0 ? (
              <img
                src={
                  hotel.images[0].startsWith("http")
                    ? hotel.images[0]
                    : `http://localhost:4040/${hotel.images[0]}`
                }
                alt={hotel.name}
              />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <h2 className="desc-title">Description:</h2>
          <p className="hotel-description">
            {hotel.description || "No description available."}
          </p>
        </div>

        {/* RIGHT */}
        <div className="hotel-right">
          <div className="right-top-actions">
            <Button
              icon={<FaRegHeart />}
              backgroundColor="white"
              color="black"
            />
            <Button icon={<FaShare />} backgroundColor="white" color="black" />

            <Button
              name="Book Now"
              backgroundColor="#000"
              color="white"
              className="book-btn"
              onClick={() => navigate(`/checkout/${hotel.hotel_id}`)}
            />
          </div>

          <div className="review-panel">
            <p>
              <strong>Total Reviews:</strong> 320
            </p>
            <div className="review-item">
              • Amazing place, loved the environment.
            </div>
            <div className="review-item">• Very clean and peaceful stay.</div>
            <div className="review-item">
              • Staff were friendly and helpful.
            </div>
          </div>

          <div className="map-button-box">
            <Button
              icon={<FaMapMarkerAlt />}
              name="Show on Map"
              backgroundColor="#e5e5e5"
              color="black"
            />
          </div>
        </div>
      </div>

      {/* RESERVATION FORM */}
      <div className="reservation-container">
        <h2>Make a Reservation</h2>

        <div className="reservation-form">
          {/* Room type */}
          <div className="form-group">
            <label>Room Type</label>
            <select
              name="room_type"
              value={reservation.room_type}
              onChange={handleChange}
            >
              <option value="">Select room type</option>
              <option value="Deluxe">
                Deluxe - R{getPriceForRoomType("Deluxe")}
              </option>
              <option value="Standard">
                Standard - R{getPriceForRoomType("Standard")}
              </option>
              <option value="Suite">
                Suite - R{getPriceForRoomType("Suite")}
              </option>
            </select>
          </div>

          {/* Dates */}
          <Input
            label="Check-in Date"
            type="date"
            name="check_in_date"
            value={reservation.check_in_date}
            onChange={handleChange}
          />
          <Input
            label="Check-out Date"
            type="date"
            name="check_out_date"
            value={reservation.check_out_date}
            onChange={handleChange}
          />

          {/* People */}
          <Input
            label="Number of People"
            type="number"
            name="people"
            value={reservation.people}
            onChange={handleChange}
          />

          {/* TOTAL PRICE DISPLAY */}
          <div className="total-price-box">
            <p>
              <strong>Total Price: </strong> R{totalPrice}
            </p>
          </div>

          {/* BUTTON */}
          <Button
            name="Reserve"
            backgroundColor="#846d29"
            color="white"
            className="reserve-btn"
            onClick={() =>
              navigate(`/checkout/${hotel.hotel_id}`, {
                state: { ...reservation, totalPrice },
              })
            }
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
