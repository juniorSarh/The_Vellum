import Input from "../../src/components/input";
import Button from "../../src/components/Button";
import "../../src/addAdminPage.css";
import Footer from "../../src/components/Footer";
import PrivatNav from "../../src/components/PrivatNav";

const Addadmin = () => {
  return (
    <div>
      <div>
        <PrivatNav />
      </div>

      <div className="addminContainer ">
        <form className="adminBox ">
          <h2>Add Admin</h2>

          <Input label="First Name" placeholder="Enter first name" />

          <Input label="Last Name" placeholder="Enter last name" />

          <Input label="Email" type="email" placeholder="Enter email" />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
          />

          <Button
            name="Add"
            backgroundColor="#846D29"
            color="white"
            className="AdminBtn"
          />
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Addadmin;
