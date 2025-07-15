// src/controllers/AuthController.js
const AuthController = {
  login: async (email, password) => {
    // Đây là logic mô phỏng. Bạn có thể gọi API thật ở đây.
    if (email === "admin@example.com" && password === "123456") {
      localStorage.setItem("user", JSON.stringify({ email }));
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  isAuthenticated: () => {
    return localStorage.getItem("user") !== null;
  },
};

export default AuthController;
