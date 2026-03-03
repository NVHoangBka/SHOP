// src/services/CategoryService.js
import api from "./api";
import { categories } from "../data/categories";

const currentLanguage = localStorage.getItem("i18n_lang");

const getTranslated = (obj, fallback = "") => {
  return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
};

class CategoryService {
  // ========= CATEGORY ==============

  async getCategoriesAll() {
    try {
      // const res = await api.get("/categories");
      return { success: true, categories };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  async getCategories() {
    try {
      // const res = await api.get("/categories");
      const result = categories.filter((c) => c.parent === null && c.isActive);
      return { success: true, categories: result };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  /**
   * LẤY TẤT CẢ DANH MỤC CON (không theo cha cụ thể)
   */
  async getSubCategories() {
    try {
      // const res = await api.get("/categories/subcategories");
      const subCategories = categories.filter(
        (c) => c.parent != null && c.isActive,
      );
      return { success: true, subCategories };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  async getCategoriesByValue(value) {
    try {
      const res = categories.filter(
        (c) => c.isActive && getTranslated(c.slug) === value,
      );
      return { success: true, category: res };
    } catch {}
  }
  /**
   * TÌM DANH MỤC THEO VALUE (nếu cần dùng sau này)
   */
  // async getCategoriesByValue(value) {
  //   try {
  //     const res = await api.get(`/categories/by-value/${value}`);
  //     return {
  //       success: true,
  //       category: res.data.category,
  //     };
  //   } catch (error) {
  //     console.error("Lỗi getCategoryByValue:", error);
  //     return this.handleError(error);
  //   }
  // }

  /**
   * LẤY DANH MỤC CON THEO DANH MỤC CHA
   */
  async getSubCategoriesByCategory(categoryId) {
    try {
      const res = [...categories];

      const subCategories = res.filter(
        (item) => item.parent === categoryId && item.isActive,
      );
      return { success: true, subCategories };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }
}

export default CategoryService;
