import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Check if the user is logged in by verifying if a token exists in localStorage
  const isLoggedIn = localStorage.getItem("token");

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1 className="logo">Navbar</h1>
        </Link>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            style={{ float: "right", marginTop: "10px" }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
