import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductTabSection = ({
  path,
  value,
  title,
  parentId,
  addToCart,
  productController,
  categoryController,
}) => {
  const [t] = useTranslation();
  const currentLanguage = localStorage.getItem("i18n_lang") || "en";
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeTab, setActiveTab] = useState();

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  // Lấy subTitles tương ứng với value của section này
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!parentId) return;

      try {
        const result =
          await categoryController.getSubCategoriesByCategory(parentId);
        if (result.success) {
          const subs = result.subCategories;
          setSubCategories(subs);

          // Tự động chọn tab đầu tiên
          if (subs.length > 0) {
            setActiveTab(subs[0]._id);
          } else {
            setActiveTab("");
          }
        }
      } catch (error) {
        console.error("Lỗi lấy subTitles:", error);
        setSubCategories([]);
        setActiveTab("");
      }
    };

    fetchSubCategories();
  }, [parentId]);

  // Logic lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      if (!parentId) return;

      try {
        let products = [];

        if (activeTab) {
          // Lọc theo subCategory cụ thể
          products =
            await productController.getProductsBySubCategory(activeTab);
        } else {
          // Lọc theo category cha (nếu không có sub hoặc tab "Tất cả")
          products = await productController.getProductsByCategory(parentId);
        }

        setFilteredProducts(products);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, [activeTab, parentId]);

  return (
    <div className="section-product-tabs mt-xl-5 mt-lg-4">
      <div className="container">
        <div className="heading-bar position-relative d-flex">
          <h2 className="w-auto mx-auto text-center position-relative z-2 bg-success-subtle d-inline px-xl-3 px-lg-2">
            <Link
              to="#"
              className="text-decoration-none fs-1 fw-semibold text-success"
            >
              {title}
            </Link>
          </h2>
        </div>
        <div className="heading-tabs mx-xl-5 mt-xl-4 mx-lg-5 mt-lg-3 row justify-content-center">
          {subCategories.slice(0, 3).map((sub) => (
            <button
              key={sub._id}
              className={`btn product-tab col-3 mx-xl-3 mx-lg-3 ${
                activeTab === sub._id ? "btn active" : "bg-white border"
              } hover`}
              onClick={() => setActiveTab(sub._id)}
            >
              {getTranslated(sub.name)}
            </button>
          ))}
        </div>
        <div className="tab-content mt-xl-4 mt-lg-4">
          <div className="product-list row bg-white py-xl-3 py-lg-3 justify-content-center m-0">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div className="col-xl-2 col-lg-3" key={index}>
                  <ProductItem
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    productController={productController}
                  />
                </div>
              ))
            ) : (
              <p className="text-center">{t("product.noProducts")}</p>
            )}
          </div>
          <Link
            to={`/products/${path}`}
            alt={t("product.features.showMore")}
            className="bg-white w-100 d-flex mt-xl-4 p-xl-2 justify-content-center text-decoration-none text-success hover rounded-2"
          >
            {t("common.view-all")}
            <i className="ms-1 bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductTabSection;
