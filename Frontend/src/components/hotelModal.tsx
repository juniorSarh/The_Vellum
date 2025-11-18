import "../HotelForm.css"; 
import Button from "./Button";

function HotelForm() {
  return (
    <form className="hotel-form">
      <div className="form-group">
        <label>Hotel Name: </label>
        <input type="text" />
      </div>

      <div className="form-group">
        <label>Location: </label>
        <input type="text" />
      </div>

      <div className="form-group">
        <label>Amenities (Comma separated): </label>
        <input type="text" />
      </div>

          <Button
                 name="Submit"
                 color="white"
                 backgroundColor="#007bff"
                 className="addHotel"
               />
    </form>
  );
}

export default HotelForm;
