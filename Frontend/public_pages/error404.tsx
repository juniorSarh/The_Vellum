
import { useNavigate } from "react-router-dom";
import "../src/Error404.css";

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <p className="error-message">Oops! Page Not Found</p>
        <p className="error-description">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button className="error-btn" onClick={() => navigate("/home")}>
          Go Back Home
        </button>
      </div>
      <div className="error-animation">
        <div className="floating-ghost">
          <div className="ghost-eyes"></div>
          <div className="ghost-bottom"></div>
        </div>
      </div>
    </div>
  );
}
