// src/models/BannerModel.js
import api from "../services/api";
import { banners } from "../data/banners";

class Banner {
  constructor(data) {
    this.id = data._id;
    this.name = data.name;
    this.image = data.image;
    this.path = data.path;
    this.type = data.type;
    this.showHome = data.showHome;
  }
}

class BannerModel {
  async getBannersAll() {
    try {
      // const res = await api.get("/banners");
      return banners.map((b) => new Banner(b));
    } catch (error) {
      console.error("Lỗi tải banner:", error);
      return [];
    }
  }
}

export default BannerModel;
