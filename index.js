const express = require("express");
const app = express();
const { initialiseDatabase } = require("./db/db.connect");
const ProductCard = require("./models/productCard.model");

initialiseDatabase();

app.use(express.json());

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
      res
        .status(200)
        .json({
          message: "Product added to wishlist successfully.",
          wishlistedProduct: wishlistedProducts,
        });
    } else {
        res.status(404).json({error: "Product not found"})
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add the product to wishlist" });
  }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
