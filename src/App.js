// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import Navbar from "@/views/components/Navbar";
import Footer from "@/views/components/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <AppRouter />
      <Footer />
    </Router>
  );
}

export default App;
