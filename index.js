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

app.post("/products/:productId/cart", async (req, res) => {
  try {
    const cartProduct = await addProductsToCart(req.params.productId, req.body);
    if (cartProduct) {
      res.status(200).json({ message: "Product added to cart successfully." });
    } else {
      res.status(404).json({ error: "product not found" });
    }
  } catch (error) {
    res.status(404).json({ error: "Error in adding product to cart" });
  }
});

async function getProductByPrice(price) {
  try {
    const products = await ProductCard.find({ productPrice: price });
    return products;
  } catch (error) {
    console.log(`Error getting products through price ${error}`);
  }
}

app.get("/products/raitngs/:rating", async (req, res) => {
  try {
    const products = getProductByPrice(req.params.rating);
    if (products != 0) {
      res.json(products);
    } else {
        res.status(404).json("No product found")
    }
  } catch (error) {
    res
      .status(500)
      .json({ json: "Failed to fetch the pruduct of this rating" });
  }
});

async function getProductByRating(productRating) {
  try {
    const products = await ProductCard.find({ productRating: productRating });
    return products;
  } catch (error) {
    console.log(`Error getting products through rating ${error}`);
  }
}

app.get("/products/ratings/:rating", async (req, res) => {
  try {
    const products = await getProductByRating(req.params.rating);
    if (products.length != 0) {
      res.json(products);
    } else {
      res.status(404).json("No product found");
    }
  } catch (error) {
    res
      .status(500)
      .json({ json: "Failed to fetch the pruduct of this rating" });
  }
});

app.get("/products/sort/price-asc", async (req, res) => {
  try {
    const products = await ProductCard.find().sort({ productPrice: 1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/products/sort/price-desc", async (req, res) => {
  try {
    const products = await ProductCard.find().sort({ productPrice: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
