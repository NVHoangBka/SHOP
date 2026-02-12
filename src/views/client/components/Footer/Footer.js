import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../component.css";
import payPal from "../../../../assets/image/paying/footer-trustbadge.webp";

const baseUrl = process.env.PUBLIC_URL || "";

const Footer = () => {
  const { t } = useTranslation();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const handleOpenSupport = () => {
    setIsSupportOpen(!isSupportOpen);
  };
  const handleOpenPolicy = () => {
    setIsPolicyOpen(!isPolicyOpen);
  };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content row mt-xl-5 mt-lg-4 mt-md-4 mt-sm-3 mt-3">
          <div className="footer-info col-lg-4 col-md-6 col-sm-12 col-12">
            <div className="footer-logo">
              <img
                src={`${baseUrl}/img/logo/LOGO.png`}
                alt=""
                className="w-50"
              />
              <p className="footer-title text-uppercase fw-bolder">
                {t("info.name")}
              </p>
            </div>
            <p className="footer-desciption m-0 pb-xl-2 pb-lg-2 pb-md-1 fs-body">
              {t("info.slogan")}
            </p>
            <p className="m-0 pb-xl-2 pb-lg-2 pb-md-1 fs-body fw-bold">
              {t("info.tax-code")}: 12345678999
            </p>
            <div className="footer-address row align-items-center">
              <i className="bi bi-geo-alt fs-6 col-1"></i>
              <p className="col m-0 ps-xl-1 ps-lg-1 ps-md-1">
                <span className="d-block">{t("info.address")}</span>
                <span className="fw-bold fs-body">
                  10 Lu Gia, District 11, Ho Chi Minh City
                </span>
              </p>
            </div>
            <div className="row justify-content-start">
              <div className="col-5">
                <div className="row align-items-center">
                  <div className="col-1">
                    <i className="bi bi-telephone fs-6"></i>
                  </div>
                  <p className="col m-0">
                    <span className="d-block">{t("info.hotline")}</span>
                    <span className="fw-bold fs-body">19008088</span>
                  </p>
                </div>
              </div>
              <div className="col-7">
                <div className="row align-items-center">
                  <div className="col-1">
                    <i className="bi bi-envelope fs-6"></i>
                  </div>
                  <p className="col m-0">
                    <span className="d-block">{t("info.email")}</span>
                    <span className="fw-bold fs-body">
                      Hoangdo.bka@gmail.com
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-support col-lg-2 col-md-6 col-sm-12 col-12 mt-4 mt-md-0">
            <div
              className="footer-title d-flex justify-content-between"
              onClick={handleOpenSupport}
            >
              <p className="fw-bolder mt-xl-1 mt-lg-1 mt-md-1 p-0">
                {t("footer.support.title")}
              </p>
              <div className="d-md-none d-block">
                <i
                  className={`bi bi-chevron-${isSupportOpen ? "down" : "right"}`}
                ></i>
              </div>
            </div>
            <ul
              className={` fs-body ${isSupportOpen ? "d-block" : "d-none d-md-block"}`}
            >
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {" "}
                {t("footer.support.contact")}
              </li>
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.support.store-locations")}
              </li>
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.support.ask-question")}
              </li>
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.support.affiliate-program")}
              </li>
            </ul>
          </div>
          <div className="footer-policy col-lg-2 col-md-6 col-sm-12 col-12 m-0">
            <div
              className="footer-title d-flex justify-content-between"
              onClick={handleOpenPolicy}
            >
              <p className="fw-bolder mt-xl-1 mt-lg-1 mt-md-1 p-0">
                {t("footer.policy.title")}
              </p>
              <div className="d-md-none d-block">
                <i
                  className={`bi bi-chevron-${isPolicyOpen ? "down" : "right"}`}
                ></i>
              </div>
            </div>
            <ul
              className={`fs-body ${isPolicyOpen ? "d-block" : "d-none d-md-block"}`}
            >
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.policy.warranty")}
              </li>
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.policy.return")}
              </li>
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.policy.privacy")}
              </li>
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.policy.terms-of-service")}
              </li>
            </ul>
          </div>
          <div className="footer-contact col-lg-2 col-md-6 col-sm-12 col-12 m-0">
            <p className="footer-title fw-bolder mt-xl-1 mt-lg-1 mt-md-1 p-0 ">
              {t("footer.support-hotline.title")}
            </p>
            <ul className="fs-body">
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.support-hotline.order")}
              </li>
              <li className="mb-xl-2 mb-lg-2 mb-md-1 text-hover">
                {t("footer.support-hotline.warranty")}
              </li>
            </ul>
          </div>
          <div className="footer-payment col-lg-2 col-md-6 col-sm-12 col-12">
            <p className="footer-title fw-bolder mt-xl-1 mt-lg-1 mt-md-1 p-0">
              {t("footer.payment.title")}
            </p>
            <div className="row">
              <img className="col-8 col-lg-12" src={payPal} alt="" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
