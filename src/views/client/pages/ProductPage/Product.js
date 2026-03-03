import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductItem from "./ProductItem";
import { useTranslation } from "react-i18next";

const Product = ({
  path,
  addToCart,
  productController,
  categoryController,
}) => {
  const [t] = useTranslation();
  const params = useParams();
  const titlePath = params.subCategory
    ? params.subCategory
    : params.category || path;
  const [activeTab, setActiveTab] = useState(path || "all");
  const [titlePathCover, setTitlePathCover] = useState();
  const [title, setTitle] = useState();

  // state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    price: null,
    brand: [],
    type: [],
    color: [],
  });

  const currentLanguage = localStorage.getItem("i18n_lang");

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  const [showFilter, setShowFilter] = useState(false);

  // === 1. CẬP NHẬT TITLE + activeTab ===
  const fetchTitle = async () => {
    if (titlePath === "all") {
      setActiveTab("all");
      setTitle("Tất cả sản phẩm");
      setTitlePathCover("Tất cả sản phẩm");
      return;
    }

    // Gọi song song nếu có subCategory
    const [categoryRes, subCategoryRes] = await Promise.all([
      categoryController.getCategoriesByValue(params.category),
      params.subCategory
        ? categoryController.getCategoriesByValue(params.subCategory)
        : Promise.resolve(null),
    ]);

    const category = categoryRes?.category?.[0] || null;
    const subCategory = subCategoryRes?.category?.[0] || null;

    if (subCategoryRes?.success && subCategory) {
      setTitle(getTranslated(subCategory.name) || "");
      setActiveTab(subCategory._id);
    } else {
      setTitle(getTranslated(category.name) || "");
      setActiveTab(category._id);
    }

    const titleCategory = getTranslated(category?.name) || "";
    const titleSubCategory = getTranslated(subCategory?.name) || "";

    const path = [titleCategory, titleSubCategory].filter(Boolean).join(" / ");

    setTitlePathCover(path);
  };

  useEffect(() => {
    fetchTitle();
  }, [titlePath, categoryController]);

  const resetAllFilters = () => {
    setFilters({
      price: null,
      brand: [],
      type: [],
      color: [],
    });

    // Bỏ tích tất cả checkbox & radio
    document
      .querySelectorAll('input[type="checkbox"], input[type="radio"]')
      .forEach((input) => {
        input.checked = false;
      });
  };

  // Hàm thay đổi filter
  const handleFilterChange = (key, e) => {
    const { type, checked, value } = e.target;
    const label = e.target.getAttribute("data-value");

    setFilters((prev) => {
      let updated = { ...prev };

      if (type === "checkbox") {
        // --- Checkbox: có thể chọn nhiều ---
        if (checked) {
          // 🔒 Kiểm tra trùng trước khi push
          const exist = updated[key]?.some((item) => item.value === value);
          if (!exist) {
            updated[key] = [...(updated[key] || []), { value, label }];
          }
        } else {
          updated[key] = (updated[key] || []).filter(
            (item) => item.value !== value,
          );
        }

        if (updated[key].length === 0) delete updated[key];
      }

      if (type === "radio") {
        // --- Radio: chỉ chọn 1 ---
        updated[key] = [{ value, label }];
      }

      return updated;
    });
  };

  const removeFilterItem = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      updated[key] = updated[key].filter((item) => item.value !== value);
      if (updated[key].length === 0) delete updated[key];
      return updated;
    });

    // Bỏ tích / bỏ chọn input tương ứng
    const input = document.querySelector(
      `input[name="${key}"][value="${value}"]`,
    );
    if (input) input.checked = false;
  };

  // Áp dụng filter khi filters thay đổi
  useEffect(() => {
    let isMounted = true;

    async function loadAndFilter() {
      setLoading(true);
      try {
        // B1: Lấy danh sách sản phẩm (await)
        let products =
          activeTab === "all"
            ? await productController.getAllProducts()
            : params.subCategory
              ? await productController.getProductsBySubCategory(activeTab)
              : await productController.getProductsByCategory(activeTab);

        // B3: Áp dụng các filter
        if (filters.price?.length > 0) {
          const [min, max] = filters.price[0].value
            .split(":")
            .map((v) => (v === "max" ? Infinity : Number(v)));
          products = products.filter(
            (p) =>
              (p.price >= min && (max === Infinity || p.price <= max)) ||
              (p.discountPrice >= min &&
                (max === Infinity || p.discountPrice <= max)),
          );
        }

        if (filters.brand?.length > 0) {
          const brands = filters.brand.map((b) => b.value);
          products = products.filter((p) =>
            p.brands?.some((b) => brands.includes(b)),
          );
        }

        if (filters.type?.length > 0) {
          const types = filters.type.map((t) => t.value);
          products = products.filter((p) =>
            p.types?.some((t) => types.includes(t)),
          );
        }

        if (filters.color?.length > 0) {
          const colors = filters.color.map((c) => c.value);
          products = products.filter((p) =>
            p.colors?.some((c) => colors.includes(c)),
          );
        }

        if (filters.tag?.length > 0) {
          const tags = filters.tag.map((t) => t.value);
          products = products.filter((p) =>
            p.tag?.some((t) => tags.includes(t)),
          );
        }

        if (isMounted) {
          setFilteredProducts(products);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        if (isMounted) setFilteredProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAndFilter();

    return () => {
      isMounted = false;
    };
  }, [activeTab, filters, productController]);

  // tính toán vị trí sản phẩm
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onColorChange = (e) => handleFilterChange("color", e);
  const onTypeChange = (e) => handleFilterChange("type", e);
  const onBrandChange = (e) => handleFilterChange("brand", e);
  const onPriceChange = (e) => handleFilterChange("price", e);
  const onTagChange = (e) => handleFilterChange("tag", e);

  return (
    <div className="product bg-success-subtle">
      <div className="container">
        <div className="breadcrumbs">
          <ul className="breadcrumb d-flex flex-wrap align-items-center py-xl-3 py-lg-3 py-md-2 py-sm-1 py-1 mb-0 ">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title={t("product.breadcrumb.home")}
                style={{ textDecoration: "none", color: "black" }}
              >
                <span>{t("product.breadcrumb.home")}</span>
              </Link>
              <span className="mx-1 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span style={{ color: "#BFBFBF" }}>{titlePathCover}</span>
            </li>
          </ul>
        </div>
        <section className="section section-collection-banner">
          <div className="collection_banner container text-center mb-xl-5 mb-lg-5 mb-md-4 mb-3 px-0">
            <Link className="banner" to="#" title={t("product.allProducts")}>
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcset="//bizweb.dktcdn.net/thumb/large/100/518/448/themes/953339/assets/collection_main_banner.jpg?1758526220617"
                />
                <img
                  className="object-contain mx-auto"
                  src="https://bizweb.dktcdn.net/100/518/448/themes/953339/assets/collection_main_banner.jpg?1758526220617"
                  width="1432"
                  height="120"
                  alt={t("product.allProducts")}
                  style={{ height: "auto", width: "100%" }}
                />
              </picture>
            </Link>
          </div>
        </section>
        <section className="section grid w-100" id="product-list-0">
          <div className="row mx-0">
            <div className="content-product-left col-xl-9 col-lg-9 col-md-9 col-12 pe-0">
              <h2 className="text-success fs-1 fw-semibold text-center text-md-start">
                {title}
              </h2>
              <div className="d-left flex-row-reverse align-items-center mb-xl-2 mb-lg-2 mb-md-1 mb-1">
                <div className="d-flex justify-content-between justify-content-md-end">
                  <button
                    className="btn btn-outline-dark d-md-none rounded-pill d-flex align-items-center me-2 bg-white border-0"
                    onClick={() => setShowFilter(true)}
                  >
                    <i className="bi bi-funnel me-2"></i>
                    {t("product.filter.title")}
                    <span className="filter-count inline-flex align-items-center justify-content-center text-white rounded-circle ms-2 bg-danger px-2">
                      0
                    </span>
                  </button>
                  <div className="sort-mobile whitespace-nowrap d-flex align-items-center me-xl-3 me-lg-3 me-md-2 me-1">
                    <label
                      htmlFor="sort-mobile"
                      className="labbel text-light-emphasis me-2"
                    >
                      {t("product.sort.label")}
                    </label>
                    <sort-by data-collection="0">
                      <select
                        name="sort_by"
                        id="sort-mobile"
                        className="form-select bg-white rounded-2"
                      >
                        <option value="manual">
                          {t("product.sort.default")}
                        </option>
                        <option value="name:asc">
                          {t("product.sort.nameAsc")}
                        </option>
                        <option value="name:desc">
                          {t("product.sort.nameDesc")}
                        </option>
                        <option value="price_min:asc">
                          {t("product.sort.priceAsc")}
                        </option>
                        <option value="price_min:desc">
                          {t("product.sort.priceDesc")}
                        </option>
                        <option value="created_on:desc">
                          {t("product.sort.newest")}
                        </option>
                        <option value="created_on:asc">
                          {t("product.sort.oldest")}
                        </option>
                      </select>
                    </sort-by>
                  </div>
                </div>
                <div className="filter-items w-100 d-flex flex-wrap mb-xl-3 mb-lg-3 mb-md-2 mb-1 mt-3 align-items-center">
                  {Object.entries(filters || {}).flatMap(([key, items]) =>
                    Array.isArray(items)
                      ? items.map((item) => (
                          <div
                            key={`${key}-${item.value}`}
                            className="filter-item bg-white d-flex fw-semibold items-center justify-content-center border rounded-1 py-1 px-xl-3 px-lg-2 px-md-2 px-2 relative cursor-pointer link mx-1 hover"
                          >
                            {item.label}
                            <span
                              className="js-remove-filter cursor-pointer ms-2"
                              onClick={() => removeFilterItem(key, item.value)}
                            >
                              <i className="bi bi-x"></i>
                            </span>
                          </div>
                        ))
                      : [],
                  )}

                  {/* Nút reset tất cả */}
                  {Object.values(filters).some(
                    (v) => Array.isArray(v) && v.length > 0,
                  ) && (
                    <div
                      className="filter-item text-danger border rounded-1 py-1 px-xl-3 px-lg-2 px-md-2 px-2 mx-1 my-1 cursor-pointer fw-semibold"
                      onClick={resetAllFilters}
                    >
                      {t("product.filter.resetAll")}
                    </div>
                  )}
                </div>
              </div>
              <div className="product-list grid mt-4 me-xl-2 me-lg-2 me-md-2 me-3">
                <div className="product-items" style={{ minHeight: "1200px" }}>
                  <div className="row">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <div
                          className="col-xl-3 col-lg-3 col-md-4 col-6 my-xl-3 my-lg-3 my-md-2 my-2"
                          key={product.id}
                        >
                          <ProductItem
                            product={product}
                            addToCart={addToCart}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-center bg-light py-3 rounded-3">
                        {t("product.noProducts")}
                      </p>
                    )}
                  </div>
                </div>
                {/* phân trang */}
                <div className="pagination d-flex justify-content-center my-xl-4">
                  {/* Nút mũi tên trái */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="btn bg-white mx-1"
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  {/* Nút số trang */}
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`btn bg-white mx-1 ${
                        currentPage === index + 1
                          ? "btn-outline-danger text-danger"
                          : "text-black"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  {/* Nút mũi tên phải */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="btn bg-white mx-1"
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`col-xl-3 col-lg-3 col-md-4 ${
                showFilter
                  ? `d-block position-fixed position-md-static top-0 end-0 bg-white overflow-auto p-3`
                  : "d-none"
              }  
              content-product-right pe-0 d-md-block h-100`}
              style={{ zIndex: "3000" }}
            >
              <div className="d-flex justify-content-between align-items-center py-2 ms-2 me-3 border-bottom">
                <h3 className="mb-0 fw-bold">{t("product.filter.title")}</h3>
                <button
                  className="btn-close d-md-none"
                  onClick={() => setShowFilter(false)}
                ></button>
              </div>
              <facet-drawer data-collection="0">
                <div className="collection-filter bg-white pb-xl-5 pb-lg-5 pb-md-5 pb-sm-5 pb-5  rounded-3">
                  <div className="facet-inner overflow-auto h-100 px-xl-2 px-lg-3 px-md-3 px-sm-2 px-3">
                    <form className="facet-form">
                      <div className="filter-container d-flex flex-column rounded-sm ps-xl-4 pt-xl-4 ps-lg-3 pt-lg-3 ps-md-2 ps-2 pt-md-2 ps-sm-1 pt-sm-1 ps-1 pt-1">
                        {/* Giá */}
                        <aside
                          className="aside-item filter-price py-xl-2"
                          style={{ order: "4" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-xl-3 fs-6">
                              {t("product.filter.price")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                <input
                                  className="form-radio form-radio_md"
                                  name="price_min"
                                  type="radio"
                                  id="filter-lower-1000000"
                                  data-group="price"
                                  data-field="price_min"
                                  data-value="Giá dưới 1.000.000₫"
                                  value="0:1000000"
                                  data-operator="OR"
                                  onChange={onPriceChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-lower-1000000"
                                >
                                  {t("product.filter.priceRanges.under1m")}
                                </label>
                              </li>
                              <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                <input
                                  className="form-radio form-radio_md"
                                  name="price_min"
                                  type="radio"
                                  id="filter-1000000-2000000"
                                  data-group="price"
                                  data-field="price_min"
                                  data-value="1.000.000₫ - 2.000.000₫"
                                  value="1000000:2000000"
                                  data-operator="OR"
                                  onChange={onPriceChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-1000000-2000000"
                                >
                                  {t("product.filter.priceRanges.1m-2m")}
                                </label>
                              </li>
                              <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                <input
                                  className="form-radio form-radio_md"
                                  name="price_min"
                                  type="radio"
                                  id="filter-2000000-3000000"
                                  data-group="price"
                                  data-field="price_min"
                                  data-value="2.000.000₫ - 3.000.000₫"
                                  value="2000000:3000000"
                                  data-operator="OR"
                                  onChange={onPriceChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-2000000-3000000"
                                >
                                  {t("product.filter.priceRanges.2m-3m")}
                                </label>
                              </li>
                              <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                <input
                                  className="form-radio form-radio_md"
                                  name="price_min"
                                  type="radio"
                                  id="filter-3000000-5000000"
                                  data-group="price"
                                  data-field="price_min"
                                  data-value="3.000.000₫ - 5.000.000₫"
                                  value="3000000:5000000"
                                  data-operator="OR"
                                  onChange={onPriceChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-3000000-5000000"
                                >
                                  {t("product.filter.priceRanges.3m-5m")}
                                </label>
                              </li>
                              <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                <input
                                  className="form-radio form-radio_md"
                                  name="price_min"
                                  type="radio"
                                  id="filter-5000000-7000000"
                                  data-group="price"
                                  data-field="price_min"
                                  data-value="5.000.000₫ - 7.000.000₫"
                                  value="5000000:7000000"
                                  data-operator="OR"
                                  onChange={onPriceChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-5000000-7000000"
                                >
                                  {t("product.filter.priceRanges.5m-7m")}
                                </label>
                              </li>
                              <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                <input
                                  className="form-radio form-radio_md"
                                  name="price_min"
                                  type="radio"
                                  id="filter-7000000-10000000"
                                  data-group="price"
                                  data-field="price_min"
                                  data-value="7.000.000₫ - 10.000.000₫"
                                  value="7000000:10000000"
                                  data-operator="OR"
                                  onChange={onPriceChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-7000000-10000000"
                                >
                                  {t("product.filter.priceRanges.7m-10m")}
                                </label>
                              </li>
                              <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                <input
                                  className="form-radio form-radio_md"
                                  name="price_min"
                                  type="radio"
                                  id="filter-upper-10000000"
                                  data-group="price"
                                  data-field="price_min"
                                  data-value="Giá trên 10.000.000₫"
                                  value="10000000:max"
                                  data-operator="OR"
                                  onChange={onPriceChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-upper-10000000"
                                >
                                  {t("product.filter.priceRanges.over10m")}
                                </label>
                              </li>
                            </ul>
                          </div>
                        </aside>
                        {/* Hãng sản xuất */}
                        <aside
                          className="aside-item filter-vendor py-xl-2"
                          style={{ order: "3" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-xl-3 fs-6">
                              {t("product.filter.brand")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center ">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-vendor-minimart"
                                  data-group="PRODUCT_VENDOR"
                                  data-field="vendor.filter_key"
                                  data-value="Minimart"
                                  value="Minimart"
                                  data-operator="OR"
                                  name="vendor"
                                  onChange={onBrandChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-vendor-minimart"
                                >
                                  Minimart
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center ">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-vendor-ega"
                                  data-group="PRODUCT_VENDOR"
                                  data-field="vendor.filter_key"
                                  data-value="EGA"
                                  value="EGA"
                                  data-operator="OR"
                                  name="vendor"
                                  onChange={onBrandChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-vendor-ega"
                                >
                                  EGA
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center ">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-vendor-ega-green"
                                  data-group="PRODUCT_VENDOR"
                                  data-field="vendor.filter_key"
                                  data-value="EGA GREEN"
                                  value="EGA GREEN"
                                  data-operator="OR"
                                  name="vendor"
                                  onChange={onBrandChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-vendor-ega-green"
                                >
                                  EGA GREEN
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center ">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-vendor-khac"
                                  data-group="PRODUCT_VENDOR"
                                  data-field="vendor.filter_key"
                                  data-value="Khác"
                                  value="Khác"
                                  data-operator="OR"
                                  name="vendor"
                                  onChange={onBrandChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-vendor-khac"
                                >
                                  Khác
                                </label>
                              </li>
                            </ul>
                          </div>
                        </aside>
                        {/*Loại sản phẩm  */}
                        <aside
                          className="aside-item filter-type py-2 "
                          style={{ order: "2" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                              {t("product.filter.type")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-lam-thom"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Làm thơm"
                                  value="Làm thơm"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-lam-thom"
                                >
                                  Làm thơm
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-chat-tay-rua"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Chất tẩy rửa"
                                  value="Chất tẩy rửa"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-chat-tay-rua"
                                >
                                  Chất tẩy rửa
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-do-dung-hoc-tap"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Đồ dùng học tập"
                                  value="Đồ dùng học tập"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-do-dung-hoc-tap"
                                >
                                  Đồ dùng học tập
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-van-phong"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Văn phòng"
                                  value="Văn phòng"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-van-phong"
                                >
                                  Văn phòng
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-nhap-khau"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Nhập khẩu"
                                  value="Nhập khẩu"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-nhap-khau"
                                >
                                  Nhập khẩu
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-nong-san-viet"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Nông sản Việt"
                                  value="Nông sản Việt"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-nong-san-viet"
                                >
                                  Nông sản Việt
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-nhiet-doi"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Nhiệt đới"
                                  value="Nhiệt đới"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-nhiet-doi"
                                >
                                  Nhiệt đới
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-thuc-pham-tuoi-song"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Thực phẩm tươi sống"
                                  value="Thực phẩm tươi sống"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-thuc-pham-tuoi-song"
                                >
                                  Thực phẩm tươi sống
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-thuc-pham"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Thực phẩm"
                                  value="Thực phẩm"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-thuc-pham"
                                >
                                  Thực phẩm
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-type-khac"
                                  data-group="PRODUCT_TYPE"
                                  data-field="type.filter_key"
                                  data-value="Khác"
                                  value="Khác"
                                  data-operator="OR"
                                  name="type"
                                  onChange={onTypeChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-type-khac"
                                >
                                  Khác
                                </label>
                              </li>
                              <li className="filter-item-toggle link text-secondary d-flex align-items-center ms-4 hover text-danger fw-bold">
                                {t("product.features.showMore")}{" "}
                                <i className="bi bi-chevron-down"></i>
                              </li>
                            </ul>
                          </div>
                        </aside>
                        {/* Màu sắc */}
                        <aside
                          className="aside-item filter-tag1 py-2 "
                          style={{ order: "0" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                              {t("product.filter.color")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-trang"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Trắng"
                                  value="white"
                                  data-operator="OR"
                                  name="color"
                                  onChange={onColorChange}
                                />
                                <label
                                  className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100"
                                  htmlFor="filter-tag1-trang"
                                >
                                  Trắng
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-den"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Đen"
                                  value="black"
                                  data-operator="OR"
                                  name="color"
                                  onChange={onColorChange}
                                />
                                <label
                                  className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100"
                                  htmlFor="filter-tag1-den"
                                >
                                  Đen
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-hong"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Hồng"
                                  value="pink"
                                  data-operator="OR"
                                  name="color"
                                  onChange={onColorChange}
                                />
                                <label
                                  className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100"
                                  htmlFor="filter-tag1-hong"
                                >
                                  Hồng
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-xam"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Xám"
                                  value="gray"
                                  data-operator="OR"
                                  name="color"
                                  onChange={onColorChange}
                                />
                                <label
                                  className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100"
                                  htmlFor="filter-tag1-xam"
                                >
                                  Xám
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-xanh"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Xanh"
                                  value="blue"
                                  data-operator="OR"
                                  name="color"
                                  onChange={onColorChange}
                                />
                                <label
                                  className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100"
                                  htmlFor="filter-tag1-xanh"
                                >
                                  Xanh
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-nau"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Nâu"
                                  value="brown"
                                  data-operator="OR"
                                  name="color"
                                  onChange={onColorChange}
                                />
                                <label
                                  className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100"
                                  htmlFor="filter-tag1-nau"
                                >
                                  Nâu
                                </label>
                              </li>

                              <li className="filter-item-toggle link text-secondary d-flex align-items-center ms-4 hover text-danger fw-bold">
                                {t("product.features.showMore")}
                                <i className="bi bi-chevron-down"></i>
                              </li>
                            </ul>
                          </div>
                        </aside>
                        {/* Tag */}
                        <aside
                          className="aside-item filter-tag1 py-2"
                          style={{ order: "1" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                              {t("product.filter.tag")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-flash-sale"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Flash Sale"
                                  value="Flash Sale"
                                  data-operator="OR"
                                  name="tag"
                                  onChange={onTagChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-tag1-flash-sale"
                                >
                                  Flash Sale
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box ">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-giao-nhanh-24h"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Giao Nhanh 24h"
                                  value="Giao Nhanh 24h"
                                  data-operator="OR"
                                  name="tag"
                                  onChange={onTagChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-tag1-giao-nhanh-24h"
                                >
                                  Giao Nhanh 24h
                                </label>
                              </li>
                              <li className="filter-item link filter-item--check-box ">
                                <input
                                  type="checkbox"
                                  className="form-checkbox form-checkbox_md"
                                  id="filter-tag1-rau-tuoi"
                                  data-group="PRODUCT_TAG"
                                  data-field="tag.key"
                                  data-value="Rau Tươi"
                                  value="Rau Tươi"
                                  data-operator="OR"
                                  name="tag"
                                  onChange={onTagChange}
                                />
                                <label
                                  className="custom-checkbox ms-2 fw-100"
                                  htmlFor="filter-tag1-rau-tuoi"
                                >
                                  Rau Tươi
                                </label>
                              </li>
                            </ul>
                          </div>
                        </aside>
                      </div>
                    </form>
                  </div>
                </div>
              </facet-drawer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Product;
