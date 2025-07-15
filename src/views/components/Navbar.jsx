// views/Navbar.jsx
import React from "react";

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleClickHome = () => {
    navigate("/");
  };
  const handleClickLogin = () => {
    navigate("/login");
  };
  return (
    <header class="header">
      <div class="header-top">
        <div className="container d-flex justify-content-between align-items-center">
          <div class="header-top-left d-flex align-items-center">
            <button className="btn btn-outline-secondary border rounded-circle">
              <i class="bi bi-list fs-5 "></i>
            </button>
            <span class="header-top-left-text ms-1">Danh mục sản phẩm</span>
          </div>
          <div class="header-top-center text-center" onClick={handleClickHome}>
            <img src="logo.png" alt="logo" class="header-logo h-75 w-50" />
          </div>
          <div class="header-top-right">
            <button className="btn btn-outline-secondary border rounded-circle m-3">
              <i class="bi bi-search fs-5"></i>
            </button>
            <button
              className="btn btn-outline-secondary border rounded-circle m-3"
              onClick={handleClickLogin}
            >
              <i className="bi bi-person fs-5"></i>
            </button>
            <button className="btn btn-outline-secondary border m-3 position-relative">
              <i className="bi bi-cart4 fs-5 "></i>
              <span className="ms-1">Giỏ hàng</span>
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.6rem" }}
              >
                3<span className="visually-hidden">số lượng sản phẩm</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div class="header-bottom bg-success">
        <div className="container">
          <ul className="navbar justify-content-center list-unstyled row ms-5 me-5 p-3 text-white mb-0">
            <li className="nav-item hover col-2 text-center">
              <a href="#" className="nav-link">
                Giới thiệu
              </a>
            </li>
            <li className="nav-item hover col-2 text-center">
              <a href="#" className="nav-link">
                Khuyến mãi
              </a>
            </li>
            <li className="nav-item  hover col-2 text-center">
              <a href="#" className="nav-link">
                Tin tức
              </a>
            </li>
            <li className="nav-item hover col-2 text-center">
              <a href="#" className="nav-link">
                Kiểm tra đơn hàng
              </a>
            </li>
            <li className="nav-item hover col-2 text-center">
              <a href="#" className="nav-link">
                Liên hệ
              </a>
            </li>
            <li className="nav-item hover col-2 text-center">
              <a href="#" className="nav-link">
                Hướng dẫn thiết lập
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
