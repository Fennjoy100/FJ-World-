import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.json());

let db: any;
let dbInitError: string | null = null;

(async () => {
  try {
    const { default: Database } = await import("better-sqlite3");
    const dbPath = process.env.VERCEL === "1" ? path.join("/tmp", "ecommerce.db") : path.join(__dirname, "..", "ecommerce.db");
    db = new Database(dbPath);

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
    const categoryCount = db.prepare("SELECT count(*) as count FROM categories").get() as { count: number };

    if (userCount.count === 0 || categoryCount.count === 0) {
      if (userCount.count === 0) {
        const hashedPassword = bcrypt.hashSync("admin123", 10);
        db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
          "Admin User",
          "admin@fennjoy.com",
          hashedPassword,
          "admin"
        );
      }

      if (categoryCount.count === 0) {
        const categories = [
          { name: "Electronics", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop" },
          { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=1000&auto=format&fit=crop" },
          { name: "gym", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop" },
          { name: "food", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop" }
        ];
        const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (name, image) VALUES (?, ?)");
        categories.forEach(cat => {
          insertCategory.run(cat.name, cat.image);
        });
      } else {
        // Force update images for existing categories to ensure they work
        const updateCategory = db.prepare("UPDATE categories SET image = ? WHERE name = ?");
        updateCategory.run("https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=1000&auto=format&fit=crop", "Fashion");
        updateCategory.run("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop", "Electronics");
        updateCategory.run("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop", "gym");
        updateCategory.run("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop", "food");
      }

      const insertProduct = db.prepare("INSERT INTO products (name, description, price, image, category_id, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");
      insertProduct.run("Headphones", "Bespoke sound engineering with premium leather finishes.", 299.99, "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop", 1, 50, 4.9);
      insertProduct.run("Smart Watch", "Elegant design meets cutting-edge health tracking.", 349.99, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop", 1, 30, 4.8);
      insertProduct.run("T shirt", "Premium cotton blend for everyday comfort and style.", 29.99, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop", 2, 20, 4.9);
      insertProduct.run("dumbbells", "Professional-grade adjustable dumbbells for your home gym.", 199.99, "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop", 3, 15, 4.7);
      
      // Add food Products
      insertProduct.run("Watermelon", "Sweet, juicy seedless watermelon, perfect for a refreshing snack.", 5.99, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000&auto=format&fit=crop", 4, 40, 4.8);
      insertProduct.run("Pizza", "Delicious wood-fired pizza with fresh mozzarella and basil.", 12.99, "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop", 4, 100, 4.9);
      insertProduct.run("Dark Chocolate", "Premium 85% cocoa crafted by master chocolatiers.", 6.99, "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1000&auto=format&fit=crop", 4, 10, 4.6);
    }

    // Ensure food products exist even if DB was already seeded
    const foodProductCount = db.prepare("SELECT count(*) as count FROM products WHERE category_id = 4").get() as { count: number };
    if (foodProductCount.count === 0) {
      const insertProduct = db.prepare("INSERT INTO products (name, description, price, image, category_id, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");
      insertProduct.run("Watermelon", "Sweet, juicy seedless watermelon, perfect for a refreshing snack.", 5.99, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000&auto=format&fit=crop", 4, 40, 4.8);
      insertProduct.run("Pizza", "Delicious wood-fired pizza with fresh mozzarella and basil.", 12.99, "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop", 4, 100, 4.9);
      insertProduct.run("Dark Chocolate", "Premium 85% cocoa crafted by master chocolatiers.", 6.99, "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1000&auto=format&fit=crop", 4, 10, 4.6);
    }
  } catch (error: any) {
    console.error("Database initialization error:", error);
    dbInitError = error.message || String(error);
  }
})();

const JWT_SECRET = process.env.JWT_SECRET || "fennjoy_secret_key";

app.use((req, res, next) => {
  if (dbInitError && req.path.startsWith('/api/')) {
    return res.status(500).json({ error: "Database initialization failed: " + dbInitError });
  }
  next();
});

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

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(__dirname, ".."),
      configFile: path.join(__dirname, "..", "vite.config.ts"),
    });
    app.use(vite.middlewares);
  } else if (process.env.VERCEL !== "1") {
    app.use(express.static(path.join(__dirname, "..", "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
    });
  }

  const PORT = 3000;
  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

if (process.env.VERCEL !== "1") {
  startServer();
}
