import db from "../data/users";
import { User } from "../models/UserModel";

class UserService {
  async login(email, password) {
    try {
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
        status: error.response?.status || 500,
      };
    }
  }
}

export default UserService;
