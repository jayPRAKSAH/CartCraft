require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cartcraft-backend" });
});

app.use("/api/products", productsRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`CartCraft API running at http://localhost:${port}`);
});
