import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Heart, Menu, X, LogOut, Package, Star, ChevronRight, ShoppingBag, Moon, Sun } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">FJ World</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Shop</Link>
            <Link to="/categories" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Categories</Link>
            <div className="relative group">
              <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={logout} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Login</Link>
            )}
            <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button className="md:hidden dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-black border-b border-black/5 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link to="/products" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md">Shop</Link>
              <Link to="/categories" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md">Categories</Link>
              {!user && <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md">Login</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-white dark:bg-black border-t border-black/5 dark:border-white/10 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 dark:text-white">Shop</h3>
          <ul className="space-y-2">
            <li><Link to="/products" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">All Products</Link></li>
            <li><Link to="/categories" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Categories</Link></li>
            <li><Link to="/featured" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Featured</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 dark:text-white">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Contact Us</Link></li>
            <li><Link to="/shipping" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Shipping</Link></li>
            <li><Link to="/returns" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Returns</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 dark:text-white">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">About Us</Link></li>
            <li><Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 dark:text-white">Newsletter</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Subscribe to get special offers and news.</p>
          <div className="flex">
            <input type="email" placeholder="Email" className="flex-1 px-4 py-2 border border-black/10 dark:border-white/10 rounded-l-lg focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white" />
            <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-r-lg text-sm font-bold">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-black/5 dark:border-white/10 pt-8 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} FJ World. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Home = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/products').then(res => res.json()).then(data => setFeaturedProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gray-50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-6 dark:text-white">
              ELEVATE YOUR <br /> <span className="text-gray-400">LIFESTYLE.</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              Discover a curated collection of premium essentials designed for the modern world. Quality meets timeless design.
            </p>
            <Link to="/products" className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all group">
              <span>Shop Collection</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden md:block relative"
          >
            <img
              src="https://picsum.photos/seed/fashion-hero/800/1000"
              alt="Hero"
              className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight dark:text-white">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400">Find exactly what you're looking for.</p>
          </div>
          <Link to="/categories" className="text-sm font-bold border-b-2 border-black dark:border-white pb-1 dark:text-white">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5 mb-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight dark:text-white">Featured Products</h2>
            <p className="text-gray-500 dark:text-gray-400">Our most loved pieces this season.</p>
          </div>
          <Link to="/products" className="text-sm font-bold border-b-2 border-black dark:border-white pb-1 dark:text-white">Shop All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 0.1} />
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product, delay = 0 }: { product: any, delay?: number, key?: any }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="absolute bottom-4 right-4 bg-white dark:bg-black text-black dark:text-white p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </Link>
      <div className="space-y-1">
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">{product.category_name}</p>
        <Link to={`/product/${product.id}`} className="block font-bold text-lg hover:underline dark:text-white">{product.name}</Link>
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</p>
          <div className="flex items-center text-xs text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="ml-1 text-gray-600 dark:text-gray-400">{product.rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category_name === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 dark:text-white">Shop All</h1>
          <p className="text-gray-500 dark:text-gray-400">Showing {filteredProducts.length} products</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-black/10 dark:border-white/10 rounded-full focus:outline-none focus:border-black dark:focus:border-white w-full sm:w-64 bg-transparent dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-full focus:outline-none focus:border-black bg-white dark:bg-black dark:text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {filteredProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} delay={i * 0.05} />
        ))}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`).then(res => res.json()).then(setProduct);
  }, [id]);

  if (!product) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{product.category_name}</p>
            <h1 className="text-5xl font-bold tracking-tight dark:text-white">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "fill-current" : "text-gray-300 dark:text-gray-700")} />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">({product.num_reviews} reviews)</span>
            </div>
            <p className="text-3xl font-medium text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="space-y-4 pt-8">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center space-x-3"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Add to Cart</span>
            </button>
            <button className="w-full border border-black/10 dark:border-white/10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center space-x-3 dark:text-white">
              <Heart className="w-6 h-6" />
              <span>Add to Wishlist</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-black/5 dark:border-white/10">
            <div className="text-center">
              <Package className="w-6 h-6 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-xs font-bold uppercase dark:text-gray-400">Free Shipping</p>
            </div>
            <div className="text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-xs font-bold uppercase dark:text-gray-400">2 Year Warranty</p>
            </div>
            <div className="text-center">
              <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-xs font-bold uppercase dark:text-gray-400">Easy Returns</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-200 dark:text-gray-800" />
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-12 dark:text-white">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="flex gap-6 pb-8 border-b border-black/5 dark:border-white/10">
              <div className="w-24 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{item.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white">-</button>
                    <span className="px-3 py-1 font-medium dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white">+</button>
                  </div>
                  <p className="font-bold ml-auto dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl h-fit space-y-6">
          <h2 className="text-xl font-bold dark:text-white">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-between text-xl font-bold dark:text-white">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.token) {
      login(data.user, data.token);
      navigate('/');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-white/5 p-10 rounded-3xl shadow-xl border border-black/5 dark:border-white/10"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center dark:text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-gray-300">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-black dark:text-white font-bold hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePlaceOrder = async () => {
    if (!user) return navigate('/login');

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart,
        totalPrice,
        paymentMethod
      })
    });

    if (res.ok) {
      clearCart();
      alert('Order placed successfully!');
      navigate('/profile');
    } else {
      alert('Failed to place order');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-12 dark:text-white">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-black/5 dark:border-white/10 space-y-6">
            <h2 className="text-xl font-bold dark:text-white">Shipping Information</h2>
            <div className="space-y-4">
              <input placeholder="Full Name" className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-transparent dark:text-white" />
              <input placeholder="Address" className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-transparent dark:text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-transparent dark:text-white" />
                <input placeholder="ZIP Code" className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-transparent dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-black/5 dark:border-white/10 space-y-6">
            <h2 className="text-xl font-bold dark:text-white">Payment Method</h2>
            <div className="space-y-3">
              {['card', 'paypal', 'cod'].map(method => (
                <label key={method} className={cn(
                  "flex items-center p-4 border rounded-xl cursor-pointer transition-all",
                  paymentMethod === method ? "border-black dark:border-white bg-gray-50 dark:bg-white/10" : "border-black/5 dark:border-white/10"
                )}>
                  <input
                    type="radio"
                    name="payment"
                    className="hidden"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span className="capitalize font-medium dark:text-white">{method === 'cod' ? 'Cash on Delivery' : method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl h-fit space-y-6">
          <h2 className="text-xl font-bold dark:text-white">Order Summary</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.name} x {item.quantity}</span>
                <span className="font-medium dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-between text-xl font-bold dark:text-white">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch('/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()).then(setOrders);
    }
  }, [user, token]);

  if (!user) return <div className="py-20 text-center">Please login to view profile</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex items-center space-x-6 mb-12">
        <div className="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black text-4xl font-bold">
          {user.name[0]}
        </div>
        <div>
          <h1 className="text-4xl font-bold dark:text-white">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8 dark:text-white">Order History</h2>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Order #{order.id}</p>
              <p className="text-lg font-bold dark:text-white">${order.total_price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={cn(
                "px-4 py-1 rounded-full text-xs font-bold uppercase",
                order.status === 'pending' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500"
              )}>
                {order.status}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-sans selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
