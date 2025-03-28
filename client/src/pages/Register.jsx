import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
} from "../redux/userSlice/userSlice";
import { Backdrop, CircularProgress, Alert } from "@mui/material";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useSelector((state) => state.theme);
  const { error, loading } = useSelector((state) => state.user);
  const [formBody, setFormBody] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormBody({
      ...formBody,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(registerStart());
      const res = await axios.post(
        "https://chat-app-sentimentai.onrender.com/api/auth/register",
        formBody
      );
      const data = res.data;
      if (!data.success) {
        dispatch(registerFailure(data.error));
        return;
      }
      localStorage.setItem("authToken", JSON.stringify(data.token));
      dispatch(registerSuccess(data));
      // Navigate based on the window width
      if (window.innerWidth > 500) {
        navigate("/app/chat");
      } else {
        navigate("/nav");
      }
    } catch (error) {
      console.log(error);
      dispatch(
        registerFailure(error.response?.data?.errorMsg || "An error occurred")
      );
    }
  };

  return (
    <div
      className={`${
        darkMode && "dark-primary"
      } h-full w-full flex justify-center items-center bg-slate-200`}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {error && (
        <div className="fixed top-10 flex bg-red-50 pr-3">
          <Alert className="transition-opacity" severity="error">
            {error}
          </Alert>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-300"
          >
            x
          </button>
        </div>
      )}
      <div className="flex h-[90%] w-[90%] flex-col md:flex-row">
        <div className="flex-1 flex flex-col justify-center items-center rounded">
          <img
            src="/logo-draft.png"
            alt="Logo"
            className="md:w-72 md:h-72 h-56 w-56"
          />
          <h1
            className={`${
              darkMode && "text-blue-300"
            } text-3xl font-semibold text-blue-700`}
          >
            Full stack chat app
          </h1>
          <p className={`${darkMode && "text-white"} text-md text-gray-700`}>
            Register to start chatting
          </p>
        </div>

        <div className="flex-1 flex justify-center items-center p-3">
          <form
            onSubmit={handleSubmit}
            className={`md:shadow-2xl md:h-[70%] w-[90%] ${
              darkMode && "md:bg-transparent md:shadow-none"
            } rounded-xl flex justify-center items-center`}
          >
            <div className="flex flex-col justify-center items-center w-full">
              <h1
                className={`${
                  darkMode && "text-blue-300"
                } text-2xl font-semibold text-blue-700 mb-4`}
              >
                Create Your Account!
              </h1>
              <input
                type="text"
                name="name"
                value={formBody.name}
                onChange={handleChange}
                placeholder="Name"
                className="placeholder:text-gray-600 w-[80%] h-12 md:bg-white border-b-2 text-black px-4 mb-4 rounded outline-none focus:ring-2 focus:ring-slate-400"
              />
              <input
                type="email"
                name="email"
                value={formBody.email}
                onChange={handleChange}
                placeholder="Email"
                className="placeholder:text-gray-600 w-[80%] h-12 md:bg-white border-b-2 text-black px-4 mb-4 rounded outline-none focus:ring-2 focus:ring-slate-400"
              />
              <input
                type="password"
                name="password"
                value={formBody.password}
                onChange={handleChange}
                placeholder="Password"
                className="placeholder:text-gray-600 w-[80%] h-12 md:bg-white border-b-2 text-black px-4 mb-4 rounded outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button
                type="submit"
                className="w-[80%] h-12 bg-blue-400 font-semibold text-black px-4 mb-4 rounded outline-none"
              >
                Register
              </button>
              <p className="flex gap-2">
                <span>Have an account?</span>
                <Link to={"/login"}>
                  <span
                    className={`${darkMode && "text-blue-300"} text-blue-700`}
                  >
                    Login
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
