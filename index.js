const express = require("express");
const app = express();
const { initialiseDatabase } = require("./db/db.connect");
const ProductCard = require("./models/productCard.model");

initialiseDatabase();

app.use(express.json());

// const products = [
//   {
//     productImg: "http://example.com/plush1.jpg",
//     isWishlisted: false,
//     productName: "Honkai: Star Rail Owlbert Plushie",
//     productPrice: 29.99,
//     isAddedToCart: false,
//     isBuyNow: false,
//     productRating: 4.5,
//     actualPrice: 29.99,
//     discountPercentage: 0,
//     productQuantity: 5,
//     productSize: [{ size: "M" }],
//     productPerks: [{ perkName: "Soft Fabric", perkIcon: "icon_fabric.png" }],
//     productDescription: [{ title: "Material", details: "Polyester" }],
//     category: [{ gender: "Unisex" }],
//   },
//   {
//     productImg: "http://example.com/keyboard1.jpg",
//     isWishlisted: true,
//     productName: "Shenhe: Lonesome Transcendence Keyboard",
//     productPrice: 269.99,
//     isAddedToCart: false,
//     isBuyNow: true,
//     productRating: 5,
//     actualPrice: 299.99,
//     discountPercentage: 10,
//     productQuantity: 2,
//     productSize: [],
//     productPerks: [
//       { perkName: "RGB Backlit", perkIcon: "icon_rgb.png" },
//       { perkName: "Warranty", perkIcon: "icon_warranty.png" },
//     ],
//     productDescription: [
//       { title: "Key Type", details: "Mechanical" },
//       { title: "Compatibility", details: "Windows and macOS" },
//     ],
//     category: [{ gender: "Men" }],
//   },
//   {
//     productImg: "http://example.com/figure1.jpg",
//     isWishlisted: false,
//     productName: "Nicole Demara 1/7 Scale Figure",
//     productPrice: 239.99,
//     isAddedToCart: false,
//     isBuyNow: false,
//     productRating: 4.7,
//     actualPrice: 239.99,
//     discountPercentage: 0,
//     productQuantity: 3,
//     productSize: [],
//     productPerks: [{ perkName: "Collector's Edition", perkIcon: "icon_collect.png" }],
//     productDescription: [
//       { title: "Material", details: "High-quality resin" },
//       { title: "Height", details: "12 inches" },
//     ],
//     category: [{ gender: "Women" }],
//   },
//   {
//     productImg: "http://example.com/socks1.jpg",
//     isWishlisted: true,
//     productName: "House of Hearth Winter Socks",
//     productPrice: 29.99,
//     isAddedToCart: true,
//     isBuyNow: false,
//     productRating: 4.3,
//     actualPrice: 39.99,
//     discountPercentage: 25,
//     productQuantity: 7,
//     productSize: [{ size: "S" }, { size: "M" }, { size: "L" }],
//     productPerks: [{ perkName: "Soft Fabric", perkIcon: "icon_soft.png" }],
//     productDescription: [{ title: "Material", details: "Wool blend" }],
//     category: [{ gender: "Unisex" }],
//   },
//   {
//     productImg: "http://example.com/plush2.jpg",
//     isWishlisted: false,
//     productName: "Fontaine Character Chibi Plush Doll",
//     productPrice: 49.99,
//     isAddedToCart: false,
//     isBuyNow: false,
//     productRating: 4.8,
//     actualPrice: 59.99,
//     discountPercentage: 16,
//     productQuantity: 10,
//     productSize: [],
//     productPerks: [{ perkName: "Limited Edition", perkIcon: "icon_limited.png" }],
//     productDescription: [
//       { title: "Material", details: "Soft and durable fabric" },
//       { title: "Care", details: "Hand washable" },
//     ],
//     category: [{ gender: "Women" }],
//   },
//   {
//     productImg: "http://example.com/boots1.jpg",
//     isWishlisted: true,
//     productName: "Wriothesley Mid-Calf Boots",
//     productPrice: 179.99,
//     isAddedToCart: false,
//     isBuyNow: true,
//     productRating: 4.6,
//     actualPrice: 199.99,
//     discountPercentage: 10,
//     productQuantity: 4,
//     productSize: [{ size: "M" }, { size: "L" }],
//     productPerks: [
//       { perkName: "Waterproof", perkIcon: "icon_waterproof.png" },
//       { perkName: "Durable Sole", perkIcon: "icon_durable.png" },
//     ],
//     productDescription: [
//       { title: "Material", details: "Leather and rubber" },
//       { title: "Style", details: "Mid-calf fit" },
//     ],
//     category: [{ gender: "Men" }],
//   },
// ];

// async function createProductCard(newProducts) {
//   try {
//     const products = await ProductCard.insertMany(newProducts);
//     console.log(products);
//   } catch (error) {
//     console.log("Error saving events:", error);
//   }
// }

// createProductCard(products);

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

async function createProductCard(newProducts) {
  try {
    const products = new ProductCard(newProducts);
    const savedProduct = await products.save();
    console.log("saved: ", savedProduct);
    return savedProduct;
  } catch (error) {
    console.log("Error saving events:", error);
  }
}

app.post("/products", async (req, res) => {
  try {
    const products = await createProductCard(req.body);
    res
      .status(201)
      .json({ message: "product saved successfully", product: products });
  } catch (error) {
    res.status(404).json({ error: "failed to get the products." });
  }
});

async function readAllProducts() {
  try {
    const products = await ProductCard.find();
    return products;
  } catch (error) {
    console.log("error fetching the data", error);
  }
}

app.get("/products", async (req, res) => {
  try {
    const products = await readAllProducts();
    if (products.length != 0) {
      res.json(products);
    } else {
      res.status(404).json({ error: "No Products found" });
    }
  } catch (error) {
    res.status(505).json({ error: "Failed to fetch the products" });
  }
});

async function wishlistedProducts() {
  try {
    const products = await ProductCard.find({ isWishlisted: true });
    return products;
  } catch (error) {
    console.log(error);
  }
}

app.get("/products/wishlisted", async (req, res) => {
  try {
    const products = await wishlistedProducts();
    if (products.length != 0) {
      res.json(products);
    } else {
      res.status(404).json({ error: "No products found" });
    }
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch the products." });
  }
});

async function wishlistProducts(productId, dataToUpdate) {
  try {
    const wishlistedProducts = await ProductCard.findByIdAndUpdate(
      productId,
      dataToUpdate,
      { new: true }
    );
    return wishlistedProducts;
  } catch (error) {
    console.log("Error in wishlisting the product.", error);
  }
}

app.post("/products/:productId/wishlist", async (req, res) => {
  try {
    const wishlistedProducts = await wishlistProducts(
      req.params.productId,
      req.body
    );
    if (wishlistedProducts) {
      res.status(200).json({
        message: "Product added to wishlist successfully.",
        wishlistedProduct: wishlistedProducts,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add the product to wishlist" });
  }
});

async function cartProducts() {
  try {
    const productsInCart = await ProductCard.find({ isAddedToCart: true });
    return productsInCart;
  } catch (error) {
    console.log(error);
  }
}

app.get("/products/inCart", async (req, res) => {
  try {
    const productsInCart = await cartProducts();
    if (productsInCart) {
      res.json(productsInCart);
    } else {
      res.status(404).json({ error: "No products found in the card." });
    }
  } catch (error) {
    res.status(500).json({ json: "Failed to get the products in the cart." });
  }
});

async function addProductsToCart(productId, dataToUpdate) {
  try {
    const cartProduct = await ProductCard.findByIdAndUpdate(
      productId,
      dataToUpdate,
      { new: true }
    );
    return cartProduct;
  } catch (error) {
    console.log("Error in adding product to cart", error);
  }
}

app.post("/products/productDetails/:productId", async (req, res) => {
    try {
        const cartProduct = await addProductsToCart(req.params.productId, req.body)
        if (cartProduct) {
            res.status(200).json({message: "Product added to cart successfully."})
        } else {
            res.status(404).json({error: "product not found"})
        }
    } catch (error) {
        res.status(404).json({error: "Error in adding product to cart"})
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
