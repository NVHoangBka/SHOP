// js/models/UserModel.js
export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || "";
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.address = data.address || "";
    this.phoneNumber = data.phoneNumber || "";
    this.cart = data.cart || [];
    this.order = data.order || [];
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      phoneNumber: this.phoneNumber,
      cart: this.cart,
      order: this.order,
    };
  }
}
