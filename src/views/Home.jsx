import React from "react";
import bannerImg1 from "@/assets/banner-group/banner_group_1.webp";
import flashsale from "@/assets/flatsale/img1.webp";
import collection1 from "@/assets/collection/coll_1.webp";
import collectionbg from "@/assets/collection/coll_bg.webp";
import Slider from "@/views/components/Slider";
import "./css/Home.css";

function Home() {
  return (
    <>
      <Slider />
      <div className="home bg-success-subtle py-4">
        <div className="container">
          <div className="section-banner-group row">
            <div className="banner-item col-4 ">
              <img src={bannerImg1} alt="" className=" w-100 rounded-4" />
            </div>
            <div className="banner-item col-4">
              <img src={bannerImg1} alt="" className=" w-100 rounded-4" />
            </div>
            <div className="banner-item col-4">
              <img src={bannerImg1} alt="" className=" w-100 rounded-4" />
            </div>
          </div>
          <div className="section-flashsale mt-5 bg-danger rounded-4 pb-3">
            <h2 className="text-white ps-3 py-4 m-0">
              Chớp thời cơ. Giá như mơ
            </h2>
            <div className="product-flashsale-list row px-1 m-0 justify-content-evenly">
              <div className="product-flashsale-item col-2 bg-white h-100 rounded-4">
                <img src={flashsale} alt="" className="w-100" />
                <p className="mt-3 line-clamp-2 fs-body fw-semibold hover">
                  Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng | Chai
                  900g
                </p>
                <div className="more d-flex justify-content-between mx-1">
                  <div className="price">
                    <p className="price-current m-0 text-warning fw-bold">
                      30.000đ
                    </p>
                    <p className="price-old text-decoration-line-through m-0">
                      60.000đ
                    </p>
                  </div>
                  <button className="text-warning border px-2 py-1 rounded-circle bg-warning-subtle hover">
                    <i className="bi bi-cart4 fs-4"></i>
                  </button>
                </div>
                <div className="rate">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star"></i>
                  <i className="bi bi-star"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-collection mt-5 position-relative">
          <img
            src={collectionbg}
            alt=""
            className="w-100 position-absolute h-100"
          />
          <div className="container">
            <div className="collection-list row py-5 position-relative fs-6 ">
              <a
                href=""
                className="collection-item text-center col text-white text-decoration-none"
              >
                <img src={collection1} alt="" className="hover mb-1" />
                <p className="m-0">Chăm sóc gia đình</p>
              </a>
              <a
                href=""
                className="collection-item text-center col text-white text-decoration-none"
              >
                <img src={collection1} alt="" className="hover mb-1" />
                <p className="m-0">Chăm sóc gia đình</p>
              </a>
              <a
                href=""
                className="collection-item text-center col text-white text-decoration-none"
              >
                <img src={collection1} alt="" className="hover mb-1" />
                <p className="m-0">Chăm sóc gia đình</p>
              </a>
              <a
                href=""
                className="collection-item text-center col text-white text-decoration-none"
              >
                <img src={collection1} alt="" className="hover mb-1" />
                <p className="m-0">Chăm sóc gia đình</p>
              </a>
              <a
                href=""
                className="collection-item text-center col text-white text-decoration-none"
              >
                <img src={collection1} alt="" className="hover mb-1" />
                <p className="m-0">Chăm sóc gia đình</p>
              </a>
              <a
                href=""
                className="collection-item text-center col text-white text-decoration-none"
              >
                <img src={collection1} alt="" className="hover mb-1" />
                <p className="m-0">Chăm sóc gia đình</p>
              </a>
            </div>
          </div>
        </div>
        <div className="section-product-tabs mt-5">
          <div className="container">
            <div className="heading-bar position-relative d-flex">
              <h2 className="w-auto mx-auto text-center position-relative z-2 bg-success-subtle d-inline px-3">
                <a
                  href=""
                  className="text-decoration-none fs-1 fw-semibold text-success"
                >
                  Chăm sóc gia đình
                </a>
              </h2>
            </div>
            <div className="heading-tabs mx-5 mt-4 row justify-content-center">
              <button className="btn product-tab col-2 mx-3 active hover">
                Nước giặt quần áo
              </button>
              <button className="btn product-tab col-2 mx-3 bg-white border hover">
                Săn deal sốc
              </button>
              <button className="btn product-tab col-2 mx-3 bg-white border hover">
                Đồng giá 9K
              </button>
            </div>
            <div className="tab-content mt-4">
              <div className="product-list row bg-white py-3 justify-content-center m-0">
                <div className="product-item col-2 p-3 border mx-2">
                  <img src={flashsale} alt="" className="w-100" />
                  <p className="mt-3 line-clamp-2 fs-body fw-semibold hover">
                    Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng |
                    Chai 900g
                  </p>
                  <div className="more d-flex justify-content-between mx-1">
                    <div className="price">
                      <p className="price-current m-0 text-warning fw-bold">
                        30.000đ
                      </p>
                      <p className="price-old text-decoration-line-through m-0">
                        60.000đ
                      </p>
                    </div>
                    <button className="text-warning border px-2 py-1 rounded-circle bg-warning-subtle hover">
                      <i className="bi bi-cart4 fs-4"></i>
                    </button>
                  </div>
                </div>
                <div className="product-item col-2 p-3 border mx-2">
                  <img src={flashsale} alt="" className="w-100" />
                  <p className="mt-3 line-clamp-2 fs-body fw-semibold hover">
                    Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng |
                    Chai 900g
                  </p>
                  <div className="more d-flex justify-content-between mx-1">
                    <div className="price">
                      <p className="price-current m-0 text-warning fw-bold">
                        30.000đ
                      </p>
                      <p className="price-old text-decoration-line-through m-0">
                        60.000đ
                      </p>
                    </div>
                    <button className="text-warning border px-2 py-1 rounded-circle bg-warning-subtle hover">
                      <i className="bi bi-cart4 fs-4"></i>
                    </button>
                  </div>
                </div>
              </div>
              <a
                href=""
                alt="Xem thêm"
                className="bg-white w-100 d-flex mt-4 p-2 justify-content-center text-decoration-none  text-success hover rounded-2"
              >
                Xem tất cả <i className="ms-1 bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="section-product-tabs mt-5">
          <div className="container">
            <div className="heading-bar position-relative d-flex">
              <h2 className="w-auto mx-auto text-center position-relative z-2 bg-success-subtle d-inline px-3">
                <a
                  href=""
                  className="text-decoration-none fs-1 fw-semibold text-success"
                >
                  Chăm sóc gia đình
                </a>
              </h2>
            </div>
            <div className="heading-tabs mx-5 mt-4 row justify-content-center">
              <button className="btn product-tab col-2 mx-3 active hover">
                Nước giặt quần áo
              </button>
              <button className="btn product-tab col-2 mx-3 bg-white border hover">
                Săn deal sốc
              </button>
              <button className="btn product-tab col-2 mx-3 bg-white border hover">
                Đồng giá 9K
              </button>
            </div>
            <div className="tab-content mt-4">
              <div className="product-list row bg-white py-3 justify-content-center m-0">
                <div className="product-item col-2 p-3 border mx-2">
                  <img src={flashsale} alt="" className="w-100" />
                  <p className="mt-3 line-clamp-2 fs-body fw-semibold hover">
                    Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng |
                    Chai 900g
                  </p>
                  <div className="more d-flex justify-content-between mx-1">
                    <div className="price">
                      <p className="price-current m-0 text-warning fw-bold">
                        30.000đ
                      </p>
                      <p className="price-old text-decoration-line-through m-0">
                        60.000đ
                      </p>
                    </div>
                    <button className="text-warning border px-2 py-1 rounded-circle bg-warning-subtle hover">
                      <i className="bi bi-cart4 fs-4"></i>
                    </button>
                  </div>
                </div>
                <div className="product-item col-2 p-3 border mx-2">
                  <img src={flashsale} alt="" className="w-100" />
                  <p className="mt-3 line-clamp-2 fs-body fw-semibold hover">
                    Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng |
                    Chai 900g
                  </p>
                  <div className="more d-flex justify-content-between mx-1">
                    <div className="price">
                      <p className="price-current m-0 text-warning fw-bold">
                        30.000đ
                      </p>
                      <p className="price-old text-decoration-line-through m-0">
                        60.000đ
                      </p>
                    </div>
                    <button className="text-warning border px-2 py-1 rounded-circle bg-warning-subtle hover">
                      <i className="bi bi-cart4 fs-4"></i>
                    </button>
                  </div>
                </div>
              </div>
              <a
                href=""
                alt="Xem thêm"
                className="bg-white w-100 d-flex mt-4 p-2 justify-content-center text-decoration-none  text-success hover rounded-2"
              >
                Xem tất cả <i className="ms-1 bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
