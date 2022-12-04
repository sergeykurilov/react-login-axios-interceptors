import React from "react";
import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LOGIN_URL = "/auth";

export const Login = () => {
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(LOGIN_URL, JSON.stringify({ user, pwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const roles = res.data.roles;
      const accessToken = res.data.accessToken;
      setAuth({ user, pwd, roles, accessToken });
      navigate(from, { replace: true });
      //clear input fields
    } catch (e) {
      if (!e.response) {
        setErrMsg("No server response");
      }
      if (e.response.status === 400) {
        setErrMsg("Missing username or password");
      }
      if (e.response.status === 401) {
        setErrMsg("Unauthorized");
      }
      setErrMsg("Registration failed");
      errRef.current.focus();
    }
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
        <p>
          Need an Account?
          <br />
          <span className="line">
            {/*put router link here*/}
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </form>
    </section>
  );
};
