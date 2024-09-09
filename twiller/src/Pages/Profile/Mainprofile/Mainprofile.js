import React, { useState, useEffect } from "react";
import Post from "../Posts/posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import Modal from "react-modal";
import useLoggedinuser from "../../../hooks/useLoggedinuser";

const Mainprofile = ({ user }) => {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [loggedinuser, setLoggedinuser] = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post, setpost] = useState([]);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const avatarOptions = ["bigHair", "bob", "bun", "curly", "dreads", "frida"];

  useEffect(() => {
    fetch(`http://localhost:5000/userpost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  }, [user.email]);

  const handleuploadcoverimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=ac19d59dbc452a1e039f82fb15abd961",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const usercoverimage = {
          email: user?.email,
          coverimage: url,
        };
        fetch(`http://localhost:5000/userupdate/${user?.email}`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(usercoverimage),
        })
          .then((res) => res.json())
          .then((data) => {
            const updatedUser = { ...loggedinuser[0], coverimage: url };
            setLoggedinuser([updatedUser]);
            setisloading(false);
          });
      })
      .catch((e) => {
        console.error("Error uploading cover image:", e);
        window.alert("Failed to upload cover image. Please try again.");
        setisloading(false);
      });
  };

  const handleuploadprofileimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=ac19d59dbc452a1e039f82fb15abd961",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userprofileimage = {
          email: user?.email,
          profileImage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userprofileimage),
          })
            .then((res) => res.json())
            .then((data) => {
              const updatedUser = { ...loggedinuser[0], profileImage: url };
              setLoggedinuser([updatedUser]);
              setisloading(false);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };

  const handleSelectAvatar = () => {
    const avatarUrl = `https://api.multiavatar.com/${selectedAvatar}.svg`;
    const userAvatar = {
      email: user?.email,
      profileImage: avatarUrl,
    };
    fetch(`http://localhost:5000/userupdate/${user?.email}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userAvatar),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedUser = { ...loggedinuser[0], profileImage: avatarUrl };
        setLoggedinuser([updatedUser]);
        setAvatarModalOpen(false);
      });
  };

  return (
    <div className="main_profile">
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          <div>
            <div className="coverImageContainer">
              <img
                src={
                  loggedinuser[0]?.coverimage
                    ? loggedinuser[0].coverimage
                    : user && user.photoURL
                }
                alt=""
                className="coverImage"
              />
              <div className="hoverCoverImage">
                <div className="imageIcon_tweetButton">
                  <label htmlFor="image" className="imageIcon">
                    {isloading ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleuploadcoverimage}
                  />
                </div>
              </div>
            </div>

            <div className="avatar-img">
              <div className="avatarContainer">
                <img
                  src={
                    loggedinuser[0]?.profileImage
                      ? loggedinuser[0].profileImage
                      : user && user.photoURL
                  }
                  alt=""
                  className="avatar"
                />
                <div className="hoverAvatarImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="profileImage" className="imageIcon">
                      {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      className="imageInput"
                      onChange={handleuploadprofileimage}
                    />
                  </div>
                </div>
              </div>

              <div className="avatarEditContainer">
                <button onClick={() => setAvatarModalOpen(true)}>
                  Set Avatar
                </button>
                <Editprofile user={user} loggedinuser={loggedinuser} />
              </div>

              <div className="userInfo">
                <h3 className="heading-3">
                  {loggedinuser[0]?.name
                    ? loggedinuser[0].name
                    : user && user.displayname}
                </h3>
                <p className="usernameSection">@{username}</p>
              </div>
            </div>

            <h4 className="tweetsText">Tweets</h4>
            <hr />
          </div>
          {post.map((p) => (
            <Post key={p._id} p={p} />
          ))}
        </div>
      </div>

      <Modal
        isOpen={avatarModalOpen}
        onRequestClose={() => setAvatarModalOpen(false)}
      >
        <h2>Select Avatar</h2>
        <div className="avatarOptions">
          {avatarOptions.map((avatar) => (
            <img
              key={avatar}
              src={`https://api.multiavatar.com/${avatar}.svg`}
              alt={avatar}
              className={`avatarOption ${
                selectedAvatar === avatar ? "selected" : ""
              }`}
              onClick={() => setSelectedAvatar(avatar)}
            />
          ))}
        </div>
        <button onClick={handleSelectAvatar}>Save Avatar</button>
        <button onClick={() => setAvatarModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Mainprofile;
