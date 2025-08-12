import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setUserFromLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { user, token } = res.data;

      if (!token) throw new Error("No token returned from API");

      // Save token for Bearer authentication
      localStorage.setItem("token", token);

      // Update AuthContext with user
      setUserFromLogin(user);

      // Redirect to dashboard
      nav("/");
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.message ||
          e.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="page login-page">
      <form onSubmit={submit} className="card login-card">
        <h2>Sign in</h2>
        {err && <div className="error">{err}</div>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
