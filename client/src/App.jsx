import React, { useState, useEffect } from "react";
import "./App.css";
import MainContainer from "./components/MainContainer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Theme from "./components/Theme";
import ProtectedRoute from "./components/ProtectedRoute";
import NoConvoOpen from "./components/NoConvoOpen";
import CreateGroup from "./components/CreateGroup";
import Profile from "./components/Profile";
import Users from "./components/Users";
import ChatArea from "./components/ChatArea";
import Groups from "./components/Groups";
import MobileNavBar from "./pages/MobileNavBar";
import EditProfile from "./components/EditProfile";
import EditGroup from "./components/EditGroup";
import User from "./components/User";
import GroupInfo from "./components/GroupInfo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  initializeSocket,
  disconnectSocket,
} from "./redux/socketSlice/socketSlice";

const App = () => {
  const dispatch = useDispatch();
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { darkMode } = useSelector((state) => state.theme);
  const { socket } = useSelector((state) => state.socket);

  // make the user online
  const handleUserOnline = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("authToken"));

      const res = await axios.get(
        `https://chat-app-sentimentai.onrender.com/api/user/is-online`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        socket.emit("user online", res.data.userId);
      } else {
        console.log("error", res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // make the user offline
  const handleUserOffline = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("authToken"));

      const res = await axios.get(
        `https://chat-app-sentimentai.onrender.com/api/user/is-offline`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        socket.emit("user offline", res.data.userId);
      } else {
        console.error("Unexpected status code:", res.status);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  // socket connection (initialization)
  useEffect(() => {
    dispatch(initializeSocket("https://chat-app-sentimentai.onrender.com"));
    return () => {
      dispatch(disconnectSocket());
    };
  }, []);

  // socket connection (setup)
  useEffect(() => {
    if (!user || !socket) return;
    socket.emit("setup", { data: user });

    handleUserOnline();

    socket.on("connection", () => {
      setSocketConnectionStatus(true);
      handleUserOnline();
    });

    socket.on("connected", () => {
      setSocketConnectionStatus(true);
    });

    socket.on("disconnect", () => {
      socket.emit("user offline", user._id);
      setSocketConnectionStatus(false);
    });

    const handleUnload = () => {
      handleUserOffline();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      handleUserOffline();
      window.removeEventListener("unload", handleUnload);
      socket.off("connection");
      socket.off("connected");
      socket.off("disconnect");
    };
  }, [socket, user]);

  return (
    <BrowserRouter>
      <div
        className={`${
          darkMode && "dark-primary"
        } relative bg-slate-200 h-screen w-screen flex justify-center items-center`}
      >
        <Theme />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/nav" element={<MobileNavBar />} />
            <Route path="app/*" element={<MainContainer />}>
              <Route path="" element={<NoConvoOpen />} />
              <Route path="chat/:chatId" element={<ChatArea />} />
              <Route path="chat-info/:chatId" element={<ChatArea />} />
              <Route path="no-convo" element={<NoConvoOpen />} />
              <Route path="create-group" element={<CreateGroup />} />
              <Route path="users" element={<Users />} />
              <Route path="groups" element={<Groups />} />
              <Route path="profile" element={<Profile />} />
              <Route path="group-info/:chatId" element={<GroupInfo />} />
              <Route path="user/:userId" element={<User />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="edit-group/:chatId" element={<EditGroup />} />
              <Route path="*" element={<NoConvoOpen />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
