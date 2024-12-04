/*
productImg
isWishlisted
productName
productPrice
isAddedToCart
isBuyNowTrue
productRating
actualPrice
discountPercentage
productQuantity
productSize
productPerks [{}{}]
productDescription
*/
// const mongoose = require("mongoose");

// const ProductCardSchema = new mongoose.Schema({
//   productImg: {
//     type: String,
//     required: true,
//   },
//   isWishlisted: {
//     type: Boolean,
//     default: false,
//   },
//   productName: {
//     type: String,
//     required: true,
//   },
//   productPrice: {
//     type: Number,
//     required: true,
//   },
//   isAddedToCart: {
//     type: Boolean,
//     default: false,
//   },
//   isBuyNowTrue: {
//     type: Boolean,
//     default: false,
//   },
//   productRating: {
//     type: Number,
//     min: 0,
//     max: 10,
//     default: 0,
//   },
//   actualPrice: {
//     type: Number,
//     required: true,
//   },
//   discountPercentage: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 0,
//   },
//   productQuantity: {
//     type: Number,
//     min: 0,
//     max: 10,
//     default: 0,
//   },
//   productSize: [
//     {
//       type: String,
//       enum: ["S", "M", "XL", "XXL"],
//     },
//   ],
//   productPerks: [
//     {
//       type: String,
//       required: true,
//     },
//   ],
//   productDescription: [
//     {
//       type: String,
//       required: true,
//     },
//   ],
// });

// const ProductCard = mongoose.model("ProductCard", ProductCardSchema);

// module.exports = ProductCard;

const mongoose = require("mongoose");

// Original Schema with arrays of strings for comparison
// const ProductCardSchema = new mongoose.Schema({
//   productImg: { type: String, required: true },
//   isWishlisted: { type: Boolean, default: false },
//   productName: { type: String, required: true },
//   productPrice: { type: Number, required: true },
//   isAddedToCart: { type: Boolean, default: false },
//   isBuyNowTrue: { type: Boolean, default: false },
//   productRating: { type: Number, min: 0, max: 10, default: 0 },
//   actualPrice: { type: Number, required: true },
//   discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
//   productQuantity: { type: Number, min: 0, max: 10, default: 0 },
//   productSize: [{ type: String, enum: ["S", "M", "XL", "XXL"] }], // Array of strings
//   productPerks: [{ type: String, required: true }],              // Array of strings
//   productDescription: [{ type: String, required: true }],        // Array of strings
// });

const ProductCardSchema = new mongoose.Schema({
  productImg: {
    type: String,
    required: true,
    // No change, keeping image as a simple string URL
  },
  isWishlisted: {
    type: Boolean,
    default: false,
    // Kept default as false, indicating a product is not wishlisted by default
  },
  productName: {
    type: String,
    required: true,
    index: true, // Added index to improve search performance
    // Index added for faster product name-based search queries
  },
  productPrice: {
    type: Number,
    required: true,
  },
  isAddedToCart: {
    type: Boolean,
    default: false,
    // Default false ensures that products are not in the cart initially
  },
  isBuyNow: {
    type: Boolean,
    default: false,
    // Renamed from `isBuyNowTrue` to `isBuyNow` for consistent camelCase naming
  },
  productRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    // Adjusted range from 0-10 to 0-5 for alignment with common rating systems
  },
  actualPrice: {
    type: Number,
    required: true,
    // No change, required for consistent pricing and discount calculations
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    // No change, ensures discounts are within valid range
  },
  productQuantity: {
    type: Number,
    min: 0,
    max: 10,
    default: 1, // Changed default from 0 to 1, indicating at least one item available
  },
  productSize: [
    {
      size: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"], required: true },
    },
    // Changed from array of strings to array of objects to include size-specific details
    // Example: { size: "M", available: true, stockCount: 20 }
  ],
  productPerks: [
    {
      perkName: { type: String, required: true },
      perkIcon: { type: String },
    },
    // Changed from array of strings to array of objects for richer perk details
    // Example: { perkName: "Free Shipping", perkDetails: "Delivered within 3-5 days" }
  ],
  productDescription: [
    {
      title: { type: String, required: true },
      details: { type: String, required: true },
    },
    // Changed from array of strings to array of objects for structured descriptions
    // Example: { title: "Display", details: "6.5-inch OLED display" }
  ],
});

const ProductCard = mongoose.model("ProductCard", ProductCardSchema);

module.exports = ProductCard;