export const userDb = {
  users: [
    {
      id: 1,
      email: "hoangdo.bka@gmail.com",
      password: "123456789", // plaintext (chỉ demo – thực tế phải hash)
      firstName: "Hoàng",
      lastName: "Nguyễn",
      phoneNumber: "0385427179",
      address: "Thanh Hóa",
      createdAt: new Date().toISOString(),
    },
  ],

  resetTokens: new Map(),

  findUserByEmail(email) {
    return this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  },

  findUserById(id) {
    return this.users.find((u) => u.id === id);
  },

  addUser(userData) {
    const newId = this.users.length
      ? Math.max(...this.users.map((u) => u.id)) + 1
      : 1;
    const newUser = {
      id: newId,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  },

  updateUser(updatedUser) {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index === -1) return false;
    this.users[index] = { ...this.users[index], ...updatedUser };
    return true;
  },

  createResetToken(email) {
    const user = this.findUserByEmail(email);
    if (!user) return null;

    const token =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 phút

    this.resetTokens.set(email, { token, expiresAt, userId: user.id });
    return token;
  },

  validateResetToken(token) {
    for (const [email, data] of this.resetTokens.entries()) {
      if (data.token === token) {
        if (Date.now() > data.expiresAt) {
          this.resetTokens.delete(email);
          return { valid: false, message: "Token đã hết hạn" };
        }
        return { valid: true, email, userId: data.userId };
      }
    }
    return { valid: false, message: "Token không hợp lệ" };
  },

  clearResetToken(email) {
    this.resetTokens.delete(email);
  },
};
