import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("We couldn't load the products. Check that the backend is running.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch = `${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const cartTotal = products.reduce(
    (total, product) => total + product.price * (cart[product.id] || 0),
    0
  );

  function addToCart(product) {
    setCart((current) => ({
      ...current,
      [product.id]: Math.min((current[product.id] || 0) + 1, product.stock)
    }));
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="CartCraft home">
          <span className="brand-mark">C</span>
          <span>CartCraft<span className="brand-dot">.</span></span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a className="active-link" href="#products">Discover</a>
          <a href="#about">Our approach</a>
        </nav>
        <div className="cart-pill" aria-live="polite">
          <span aria-hidden="true">🛍</span>
          <span>Bag</span>
          <strong>{cartCount}</strong>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> THE EVERYDAY EDIT</p>
            <h1>Good finds.<br /><span>Great everyday.</span></h1>
            <p className="hero-description">
              Discover thoughtful essentials for your desk, your day, and everywhere in between.
            </p>
            <a className="primary-link" href="#products">Explore the collection <span>↘</span></a>
            <div className="hero-note"><span className="note-star">✳</span> Made for the way you live.</div>
          </div>
          <div className="hero-art" aria-label="Curated everyday shopping collection">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-card art-card-main"><span>🎧</span><small>FOCUS MODE</small></div>
            <div className="art-card art-card-backpack"><span>🎒</span></div>
            <div className="art-card art-card-lamp"><span>💡</span></div>
            <div className="art-tag"><span>✦</span> little things, better days</div>
            <div className="art-spark spark-one">✳</div>
            <div className="art-spark spark-two">✦</div>
          </div>
          <div className="hero-index"><strong>01</strong><span> / CURATED ESSENTIALS</span></div>
        </section>

        <section id="products" className="product-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE CARTCRAFT COLLECTION</p>
              <h2>Find your next <span>favorite.</span></h2>
            </div>
            <p className="section-aside">Useful by design.<br />Made for everyday life.</p>
          </div>

          <div className="catalog-controls">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search the collection..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
              />
            </label>
            <div className="category-list" aria-label="Filter by category">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`category-chip ${category === item ? "selected" : ""}`}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="state-message">Getting the good stuff ready…</p>}
          {error && <div className="error-panel" role="alert">{error}<br /><small>API: {API_BASE_URL}/api/products</small></div>}
          {!loading && !error && visibleProducts.length === 0 && (
            <p className="state-message">No products match that search. Try another term.</p>
          )}

          <div className="product-grid">
            {visibleProducts.map((product, index) => (
              <article className="product-card" key={product.id}>
                <div className={`product-visual visual-${index % 6}`}>
                  <span className="product-emoji" aria-hidden="true">{product.emoji}</span>
                  <span className="product-number">{String(index + 1).padStart(2, "0")}</span>
                  <button
                    type="button"
                    className="quick-add"
                    onClick={() => addToCart(product)}
                    disabled={(cart[product.id] || 0) >= product.stock}
                    aria-label={`Add ${product.name} to bag`}
                  >+</button>
                </div>
                <div className="product-meta"><span>{product.category}</span><span>{product.stock} in stock</span></div>
                <div className="product-title-row">
                  <h3>{product.name}</h3>
                  <strong>{money.format(product.price)}</strong>
                </div>
                <p className="product-description">{product.description}</p>
                <button className="add-button" type="button" onClick={() => addToCart(product)} disabled={(cart[product.id] || 0) >= product.stock}>
                  {(cart[product.id] || 0) >= product.stock ? "Stock limit reached" : "Add to bag"}
                  <span>{cart[product.id] ? `In bag: ${cart[product.id]}` : "↗"}</span>
                </button>
              </article>
            ))}
          </div>

          <div className="bag-summary" aria-live="polite">
            <div><span className="bag-icon">🛍</span><div><strong>Your bag</strong><small>{cartCount} {cartCount === 1 ? "item" : "items"} selected</small></div></div>
            <div className="bag-total"><small>SUBTOTAL</small><strong>{money.format(cartTotal)}</strong></div>
            <button type="button" className="checkout-button" disabled={cartCount === 0} onClick={() => window.alert("Checkout is a demo feature and is not connected yet.")}>Continue <span>→</span></button>
          </div>
        </section>

        <section id="about" className="about-strip">
          <span className="about-star">✳</span>
          <p>Less clutter. More <em>good stuff.</em></p>
          <span className="about-caption">A considered collection for your everyday.</span>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark">C</span><span>CartCraft<span className="brand-dot">.</span></span></a>
        <span>Thoughtfully picked. Everyday ready.</span>
        <span>© {new Date().getFullYear()} CartCraft</span>
      </footer>
    </div>
  );
}
