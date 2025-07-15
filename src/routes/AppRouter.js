// src/routes/AppRouter.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import Login from "../views/Login";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRouter;
