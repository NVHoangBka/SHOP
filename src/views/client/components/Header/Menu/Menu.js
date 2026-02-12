import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";

const Menu = ({ menuRef, onClose, categoryController, getTranslated }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesMenu, setCategoriesMenu] = useState([]);
  const [isOpenSubMenu, setIsOpenSubMenu] = useState(false);

  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const result = await categoryController.getCategoriesAll();
    if (result.success) {
      const categories = result.categories;

      const categoriesMenu = result.categories.filter(
        (cat) => cat.parent === null && cat.isActive,
      );
      setCategories(categories);
      setCategoriesMenu(categoriesMenu);
    }
    setLoading(false);
    return result;
  };

  useEffect(() => {
    fetchCategories();
  }, [categoryController]);

  const getSubCategories = (categoryId) => {
    return categories.filter(
      (cat) => cat.parent === categoryId && cat.isActive,
    );
  };

  const handleItemClick = () => {
    onClose(false);
  };
  const handSubMenuOpen = (e) => {
    e.preventDefault();
    setIsOpenSubMenu(!isOpenSubMenu);
  };

  if (loading) return <div>{t("menu.loading")}</div>;

  return (
    <nav ref={menuRef} className="h-100">
      <div className="menu-container">
        <div className="menu-content">
          <ul className="menu-list">
            <li>
              <Link
                to="/products/all"
                onClick={handleItemClick}
                className="menu-hover"
              >
                <span className="fw-medium">{t("menu.allProducts")}</span>
              </Link>
            </li>
            {categoriesMenu.length > 0 ? (
              categoriesMenu.map((category) => {
                const subCategories = getSubCategories(category._id);
                return (
                  <li key={category._id} className="dropdown-submenu">
                    <Link
                      to={`/products/${getTranslated(category.slug)}`}
                      className="d-flex justify-content-between menu-hover"
                      aria-haspopup="true"
                      aria-expanded={
                        subCategories?.length > 0 ? "false" : undefined
                      }
                    >
                      <span className="fw-medium">
                        {getTranslated(category.name)}
                      </span>
                      {subCategories?.length > 0 && (
                        <i
                          className="bi bi-caret-right-fill d-flex align-items-center"
                          onClick={handSubMenuOpen}
                        ></i>
                      )}
                    </Link>

                    {subCategories?.length > 0 && (
                      <ul className={`submenu-list `}>
                        <div className="dropdown-submenu-arrow px-3 py-2 d-flex align-items-center bg-light border-bottom">
                          <i
                            className="bi bi-caret-left-fill"
                            onClick={handSubMenuOpen}
                          ></i>
                          {getTranslated(category.name)}
                        </div>
                        {subCategories.map((subCategory) => (
                          <li
                            key={subCategory._id}
                            className={`menu-hover ${isOpenSubMenu ? "activeOpen" : ""}`}
                          >
                            <Link
                              to={`/products/${getTranslated(
                                category.slug,
                              )}/${getTranslated(subCategory.slug)}`}
                              onClick={handleItemClick}
                            >
                              {getTranslated(subCategory.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })
            ) : (
              <li>{t("menu.noCategory")}</li>
            )}
          </ul>
          <ul className="menu-list">
            <li>
              <Link
                to="/introduce"
                onClick={handleItemClick}
                className="menu-hover"
              >
                {t("menu.introduce")}
              </Link>
            </li>
            <li className="dropdown-submenu">
              <Link
                to="#"
                title={t("menu.flashSale")}
                className="d-flex justify-content-between menu-hover"
              >
                <span>{t("menu.flashSale")}</span>
                <i className="bi bi-caret-right-fill d-flex align-items-center"></i>
              </Link>
              <ul className="menu-list">
                <li className="menu-hover">
                  <Link to="#" onClick={handleItemClick}>
                    {t("menu.flashSaleSingleSlot")}
                  </Link>
                </li>
                <li className="menu-hover">
                  <Link to="#" onClick={handleItemClick}>
                    {t("menu.flashSaleMultipleSlots")}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/news" onClick={handleItemClick} className="menu-hover">
                {t("menu.news")}
              </Link>
            </li>
            <li>
              <Link
                to="/check-order"
                onClick={handleItemClick}
                className="menu-hover"
              >
                {t("menu.checkOrder")}
              </Link>
            </li>
            <li>
              <Link to="#" onClick={handleItemClick} className="menu-hover">
                {t("menu.contact")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="menu-footer row mx-xl-0 border-top pt-xl-2 mx-0 pt-2 align-items-center">
          <div className="col-xl-6 py-xl-4 col-6 py-3 menu-hover">
            <i className="bi bi-shop border p-xl-2 p-1"></i>
            <span className="ps-2">{t("menu.storeSystem")}</span>
          </div>
          <div className="col-xl-6 py-xl-4 col-6 py-2 menu-hover ">
            <i className="bi bi-telephone-outbound border p-xl-2 p-1"></i>
            <span className="ps-xl-2">Holine: 0999999998</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
