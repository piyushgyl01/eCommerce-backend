const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    street: { type: String, required: true },
    town: { type: String, required: true },
    province: { type: String, required: true },
    zip: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", AddressSchema);

module.exports = Address;
