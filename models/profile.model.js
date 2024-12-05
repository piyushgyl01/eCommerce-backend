const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
