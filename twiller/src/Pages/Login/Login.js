import React, { useState } from "react";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useNavigate, Link } from "react-router-dom";
// import { Button } from "@mui/material";
import "./login.css";
import { useUserAuth } from "../../context/UserAuthContext";
// import { EmailAuthCredential } from "firebase/auth";
const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { googlesignin, login } = useUserAuth();
  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      seterror(error.message);
      window.alert(error.message);
    }
  };
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googlesignin();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
       <div className="login-container">
        <div className="image-container">
          <img src={twitterimg} className="image" alt="twitterimage" />
        </div>

        <div className="form-container">
          <div className="">
            <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
            <h2 className="heading">Happening now</h2>
            <div class="d-flex align-items-sm-center">
              <h3 className="heading1">join twiller today</h3>
            </div>
            {error && <p className="errorMessage">{error}</p>}
            <form onSubmit={handlesubmit}>
              <input
                className="email"
                type="email"
                placeholder="Email Address"
                onChange={(e) => setemail(e.target.value)}
              />
              <input
                className="password"
                type="password"
                placeholder="password"
                onChange={(e) => setpassword(e.target.value)}
              />
              <div className="btn-login">
                <button type="submit" className="btn">
                  Log In
                </button>
              </div>
            </form>
            <hr />     
            <div className="google-button">
              <GoogleButton
                className="g-btn"
                type="light"
                onClick={handleGoogleSignIn}
              />
            </div>
            <div>
            &nbsp; &nbsp; &nbsp; Already have an account ?
              <Link
                to="/Signup"
                style={{
                  textDecoration: "none",
                  color: "var(--twitter-color)",
                  fontWeight: "600",
                  marginLeft: "5px",
                }}
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
