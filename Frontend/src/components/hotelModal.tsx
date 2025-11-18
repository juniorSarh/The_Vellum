import "../HotelForm.css"; 

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

     
    </form>
  );
}

export default HotelForm;
