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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
