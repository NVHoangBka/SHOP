import ProductModel from "../models/ProductModel";
import api from "./api";
import products from "../data/products";

const currentLanguage = localStorage.getItem("i18n_lang");

const getTranslated = (obj, fallback = "") => {
  return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
};
class ProductService {
  constructor() {
    this.productModel = new ProductModel();
    this.allProducts = null;
  }

  async getAllProducts() {
    try {
      // const res = await api.get("/products");
      // return this.productModel.mapProducts(res.data.products);
      const res = products;
      return this.productModel.mapProducts(res.products);
    } catch (error) {}
    return this.allProducts;
  }

  // async getProductsByTitle(titlePath) {
  //   const res = await api.get(`/products/title/${titlePath}`);
  //   return this.productModel.mapProducts(res.data.products);
  // }

  // async getProductsBySubTitle(subTitlePath) {
  //   const res = await api.get(`/products/subtitle/${subTitlePath}`);
  //   return this.productModel.mapProducts(res.data.products);
  // }

  // async getProductsByTag(tag) {
  //   const res = await api.get(`/products/tag/${tag}`);
  //   return this.productModel.mapProducts(res.data.products);
  // }

  // async getProductsByType(type) {
  //   const res = await api.get(`/products/type/${type}`);
  //   return this.productModel.mapProducts(res.data.products);
  // }

  // async getProductById(id) {
  //   const res = await api.get(`/products/${id}`);
  //   return this.productModel.mapProduct(res.data.products);
  // }

  async getProductsByCategory(categoryId) {
    const res = products.products;
    const resultProducts = res.filter((item) =>
      item.categories?.some((c) => c.id === categoryId),
    );

    return this.productModel.mapProducts(resultProducts);
  }

  async getProductsBySubCategory(subCategoryId) {
    const res = products.products;
    const resultProducts = res.filter((item) =>
      item.subCategories?.some((c) => c.id === subCategoryId),
    );
    return this.productModel.mapProducts(resultProducts);
  }

  async getProductBySlug(slug) {
    const res = products.products;
    const resultProducts = res.find(
      (item) => getTranslated(item.slug) === slug,
    );
    return this.productModel.mapProduct(resultProducts);
  }

  // async filterProducts(criteria) {
  //   let products = await this.getAllProducts();

  //   if (criteria.titlePath) {
  //     products = await this.getProductsByTitle(criteria.titlePath);
  //   }
  //   if (criteria.subTitlePath) {
  //     products = await this.getProductsBySubTitle(criteria.subTitlePath);
  //   }
  //   return products;
  // }

  // async search(query, category = "all") {
  //   if (!query?.trim()) return [];
  //   const params = { q: query };
  //   if (category !== "all") params.category = category;

  //   const res = await api.get("/products/search/live", { params });
  //   return this.productModel.mapProducts(res.data.products);
  // }

  // Bonus: Lấy sản phẩm nổi bật, mới nhất, v.v.
  // async getFeaturedProducts(limit = 12) {
  //   const res = await api.get("/products?sort=-createdAt&limit=" + limit);
  //   return this.productModel.mapProducts(res.data.products);
  // }
}

export default ProductService;
