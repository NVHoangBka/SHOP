import React, { useEffect, useState } from "react";
import Slider from "../../components/Slider";
import ProductItem from "../ProductPage/ProductItem";
import ProductTabSection from "../ProductPage/ProductTabSection";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = ({
  addToCart,
  productController,
  bannerController,
  categoryController,
}) => {
  const { t } = useTranslation();
  const currentLanguage = localStorage.getItem("i18n_lang") || "en";

  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [bannerHome, setBannerHome] = useState([]);
  const [categoriesHome, setCategoriesHome] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await productController.getAllProducts();
        const banners = await bannerController.getBannersAll();
        const resCategories = await categoryController.getCategories();

        if (resCategories.success) {
          const categories = resCategories.categories;
          const featuredCategories = categories.filter(
            (category) => category.isFeatured === true,
          );
          setCategoriesHome(featuredCategories);
        }

        const flashSale = orders.filter((order) => order.flashSale === true);

        setFlashSaleProducts(flashSale);
        setBannerHome(banners);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [bannerController, productController, categoryController]);

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  return (
    <>
      <Slider />
      <div className="home bg-success-subtle py-xl-4 py-lg-4 py-md-3 py-sm-2 py-1">
        <div className="container">
          <div className="section-banner-group row flex-nowrap flex-lg-wrap overflow-auto overflow-lg-visible my-3">
            {bannerHome
              .filter((banner) => banner.showHome === true)
              .map((banner, index) => (
                <div key={index} className="banner-item col-8 col-lg-4">
                  <img
                    src={banner.image}
                    alt="Banner 1"
                    className="w-100 rounded-4"
                  />
                </div>
              ))}
          </div>
          <div className="section-flashsale bg-danger rounded-4 mt-xl-5 pb-xl-3 mt-lg-5 pb-lg-3 mt-md-4 pb-md-3 mt-sm-3 pb-sm-2">
            <h2 className="text-white ps-xl-3 py-xl-4 m-0 py-lg-3 ps-lg-3 py-md-2 ps-md-2 py-sm-1 ps-sm-1 ps-2 py-2">
              {t("home.flash-sale-title")}
            </h2>
            <div className="product-flashsale-list flex-nowrap row overflow-auto overflow-md-visible p-3 justify-content-lg-center">
              {flashSaleProducts.length > 0 ? (
                flashSaleProducts.slice(0, 6).map((product, index) => (
                  <div
                    className="col-6 col-sm-4 col-md-4 col-xl-2 col-lg-3"
                    key={index}
                  >
                    <ProductItem
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-white">
                  {t("home.no-flash-sale")}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="section-collection mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-3 position-relative">
          <img
            src="https://bizweb.dktcdn.net/100/518/448/themes/953339/assets/coll_bg.jpg?1733201190476"
            alt="Collection Background"
            className="w-100 position-absolute h-100"
          />
          <div className="container">
            <div className="collection-list row py-xl-5 py-lg-4 py-md-3 py-sm-2 py-2 position-relative fs-6">
              {/* {titlesHome.map((title, index) => (
                <Link
                  key={index}
                  to="#"
                  className="collection-item text-center col text-white text-decoration-none"
                >
                  <img
                    src={title.image}
                    alt={title.name}
                    className="hover mb-1"
                  />
                  <p className="m-0">{title.name}</p>
                </Link>
              ))} */}
            </div>
          </div>
        </div>

        {[...categoriesHome]
          .sort((a, b) => (a.homeOrder ?? 9999) - (b.homeOrder ?? 9999))
          .map((category, index) => (
            <ProductTabSection
              key={index}
              path={getTranslated(category.slug)}
              title={getTranslated(category.name)}
              value={getTranslated(category.value)}
              parentId={category._id}
              addToCart={addToCart}
              productController={productController}
              categoryController={categoryController}
            />
          ))}
      </div>
    </>
  );
};

export default Home;
