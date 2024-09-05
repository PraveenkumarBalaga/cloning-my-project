import React, { useState } from "react";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@mui/material";
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
          <img src={twitterimg} className="image" alt="twitterimg" />
        </div>
        <div className="form-container">
          <div className="form-box">
            <TwitterIcon style={{ color: "skyblue" }} />
            <h2 className="heading">Happening now</h2>
            {error && <p>{error.message}</p>}
            <form onSubmit={handlesubmit}>
              <input
                type="email"
                className="email"
                placeholder="Email address"
                onChange={(e) => setemail(e.target.value)}
              />
              <input
                type="password"
                className="password"
                placeholder="password"
                onChange={(e) => setpassword(e.target.value)}
              />
              <div className="btn-login">
                <Button type="submit" className="btn">
                  Log In
                </Button>
              </div>
            </form>
            <hr />
            <div>
              <GoogleButton
                className="g-btn"
                type="light"
                onClick={handleGoogleSignIn}
              />
            </div>
          </div>
          <div>
            Don't have an account
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
