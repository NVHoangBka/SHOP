// views/LoginView.jsx
import React, { useState } from "react";
import AuthController from "../controllers/AuthController";
import "./css/Login.css";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await AuthController.login(email, password);
    setMessage(result.message);
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center bg-success-subtle m-0">
      <div className="card shadow p-4 rounded-4">
        <h3 className="text-center mb-4">
          <img className="logo" src="logo.png" alt="" />
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-submit w-100 btn-lg">
            Đăng nhập
          </button>

          {message && (
            <div className="alert alert-info mt-3 text-center" role="alert">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginView;
