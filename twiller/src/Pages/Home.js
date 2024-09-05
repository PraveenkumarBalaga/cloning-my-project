import React from "react";
import Sidebar from "./Sidebar/sidebar";
import Widgets from "./Widgets/Widgets";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
const Home = () => {
  const {logOut,user}=useUserAuth()
  const navigate = useNavigate();
  // const user = {
  //   displayname: "praveen",
  //   email: "praveen@gmail.com",
  // };
  const handlelogout = async () => {
    try { 
      await logOut()
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="app">
      <Sidebar handlelogout={handlelogout} user={user} />
      <Outlet />
      <Widgets />
    </div>
  );
};

export default Home;