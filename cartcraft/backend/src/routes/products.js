const express = require("express");
const products = require("../data/products");

const router = express.Router();

router.get("/", (req, res) => {
  const query = String(req.query.q || "").trim().toLowerCase();
  const category = String(req.query.category || "").trim().toLowerCase();

  let result = products;

  if (query) {
    result = result.filter((product) =>
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(query)
    );
  }

  if (category) {
    result = result.filter((product) => product.category.toLowerCase() === category);
  }

  res.json({ count: result.length, products: result });
});

router.get("/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({ product });
});

module.exports = router;
