import { useState, useEffect  } from "react"; // Import useState hook from React
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate from react-router-dom
import "../components/CSS/Login.css"; // Import CSS file for custom styles
import axios from "axios"; // Import Axios for HTTP requests
import { URL } from "../url"; // Import URL from a separate file
import { useContext } from "react"; // Import useContext hook from React
import { UserContext } from "../context/UserContext"; // Import UserContext for accessing user data
import Menu from "../components/Menu"; // Import Menu component
import Disclaimer from "../components/Disclaimer"; // Import Disclaimer component

// Define the Login component
const Login = () => {
  // Define state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { setUser } = useContext(UserContext);
  const [loading] = useState(false);

  // Use navigate hook from react-router-dom
  const navigate = useNavigate();

  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    // Show the overlay after 5 seconds
    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOverlay]);

  // Function to handle login process
  const handleLogin = async () => {
    try {
      // Send a POST request to login endpoint with email and password
      const res = await axios.post(
        URL + "/api/auth/login",
        { email, password },
        { withCredentials: true } // Include cookies with the request
      );
      // Set user data in context and navigate to Home page
      setUser(res.data);
      navigate("/Home");
      console.log(res.data);
    } catch (err) {
      setError(true); // Set error state to true if login fails
      console.log(err);
    }
  };

  // Render the Login component
  return (
    <>
      <Menu /> {/* Render Menu component */}
      {/* Main login container */}
      <div className="w-full flex justify-center items-center h-[80vh] the-main-login-container">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left text-white login-heading">Log into Your Account</h1>
          {/* Input field for email */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0 mt-4"
            type="email"
            placeholder="Enter your Email"
          />
          {/* Input field for password */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="password"
            placeholder="Enter your password"
          />
          {/* Login button */}
          <button
            onClick={handleLogin}
            className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-slate-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {/* Display error message if login fails */}
          {error && (
            <h3 className="text-red-500 text-sm">Something went wrong</h3>
          )}
          {/* Link to registration page */}
          <div className="flex justify-center items-center space-x-3 text-white">
            <p>New here</p>
            <p className="hover:text-pink-500">
              <Link to="/register" className="register-link">Register</Link>
            </p>
          </div>
        </div>
      </div>
      <Disclaimer /> {/* Render Disclaimer component */}

      {/* Full-screen overlay */}
      {showOverlay && (
        <div className="overlay fixed top-0 left-0 w-full h-full bg-black flex justify-center items-center z-50">
          <div className="text-center text-white text-2xl font-bold animate-fade-in">
            This site is currently offline.<br />
    Access has been restricted due to scheduled updates, security enhancements, or administrative actions.<br />
    Please visit the  below link. 
            <div className="flex items-center justify-center p-6 rounded-xl border shadow-sm bg-white">
              <a
                href="http://ec2-13-53-174-4.eu-north-1.compute.amazonaws.com:3000/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-black px-5 py-3 text-white font-medium transition hover:opacity-90"
              >
                Upgraded
              </a>
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login; // Export the Login component
