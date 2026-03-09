import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "..", "ecommerce.db"));

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category_id INTEGER,
    stock INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    num_reviews INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin User",
    "admin@fjworld.com",
    hashedPassword,
    "admin"
  );

  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports"];
  const insertCategory = db.prepare("INSERT INTO categories (name, image) VALUES (?, ?)");
  categories.forEach(cat => {
    insertCategory.run(cat, `https://picsum.photos/seed/${cat.toLowerCase()}/400/400`);
  });

  const insertProduct = db.prepare("INSERT INTO products (name, description, price, image, category_id, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertProduct.run("Premium Wireless Headphones", "High-quality sound with noise cancellation.", 199.99, "https://picsum.photos/seed/headphones/600/600", 1, 50, 4.5);
  insertProduct.run("Modern Smart Watch", "Track your fitness and stay connected.", 149.99, "https://picsum.photos/seed/watch/600/600", 1, 30, 4.2);
  insertProduct.run("Classic Leather Jacket", "Timeless style for any occasion.", 89.99, "https://picsum.photos/seed/jacket/600/600", 2, 20, 4.8);
  insertProduct.run("Ergonomic Office Chair", "Work in comfort with adjustable support.", 249.99, "https://picsum.photos/seed/chair/600/600", 3, 15, 4.6);
  
  // Add Sports Products
  insertProduct.run("Performance Running Shoes", "Lightweight and breathable for maximum speed.", 129.99, "https://picsum.photos/seed/runningshoes/600/600", 4, 40, 4.7);
  insertProduct.run("Professional Yoga Mat", "Non-slip surface for perfect balance.", 49.99, "https://picsum.photos/seed/yogamat/600/600", 4, 100, 4.9);
  insertProduct.run("Adjustable Dumbbell Set", "Versatile weight training for home workouts.", 299.99, "https://picsum.photos/seed/dumbbells/600/600", 4, 10, 4.4);
}

// Ensure sports products exist even if DB was already seeded
const sportsProductCount = db.prepare("SELECT count(*) as count FROM products WHERE category_id = 4").get() as { count: number };
if (sportsProductCount.count === 0) {
  const insertProduct = db.prepare("INSERT INTO products (name, description, price, image, category_id, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertProduct.run("Performance Running Shoes", "Lightweight and breathable for maximum speed.", 129.99, "https://picsum.photos/seed/runningshoes/600/600", 4, 40, 4.7);
  insertProduct.run("Professional Yoga Mat", "Non-slip surface for perfect balance.", 49.99, "https://picsum.photos/seed/yogamat/600/600", 4, 100, 4.9);
  insertProduct.run("Adjustable Dumbbell Set", "Versatile weight training for home workouts.", 299.99, "https://picsum.photos/seed/dumbbells/600/600", 4, 10, 4.4);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const JWT_SECRET = process.env.JWT_SECRET || "fjworld_secret_key";

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // API Routes
  app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
      const user = { id: result.lastInsertRowid, name, email, role: 'user' };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
      res.json({ user, token });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: userWithoutPassword, token });
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id").all();
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?").get(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.post("/api/orders", authenticate, (req: any, res) => {
    const { items, totalPrice, paymentMethod } = req.body;
    const userId = req.user.id;

    const transaction = db.transaction(() => {
      const result = db.prepare("INSERT INTO orders (user_id, total_price, payment_method) VALUES (?, ?, ?)").run(userId, totalPrice, paymentMethod);
      const orderId = result.lastInsertRowid;

      const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
      for (const item of items) {
        insertItem.run(orderId, item.id, item.quantity, item.price);
        db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(item.quantity, item.id);
      }
      return orderId;
    });

    try {
      const orderId = transaction();
      res.json({ id: orderId, message: "Order placed successfully" });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/orders/my-orders", authenticate, (req: any, res) => {
    const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(__dirname, "..", "frontend"),
      configFile: path.join(__dirname, "..", "vite.config.ts"),
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "..", "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
