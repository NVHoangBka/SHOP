import api from "./api";
import tagsData from "../data/tags";
import typesData from "../data/types";
import colorsData from "../data/colors";

class TagService {
  // === LẤY DANH SÁCH ===
  async getAllTags() {
    try {
      return tagsData;
    } catch (error) {}
  }

  async getAllTypes() {
    try {
      return typesData;
    } catch (error) {}
  }

  async getAllColors() {
    try {
      return colorsData;
    } catch (error) {}
  }
}

export default TagService;
