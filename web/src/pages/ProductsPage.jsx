import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Filter, X, Loader2, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import pb from '@/lib/pocketbaseClient';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useCurrency } from '@/contexts/CurrencyContext.jsx';
import { useDebounce } from '@/hooks/useDebounce.js';

const ProductsPage = () => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [category, setCategory] = useState('');
  
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('hgw_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('hgw_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let filter = '';
      if (debouncedSearch) filter += `name ~ "${debouncedSearch}"`;
      if (category) filter += (filter ? ' && ' : '') + `category="${category}"`;

      const result = await pb.collection('products').getList(1, 20, {
        filter,
        sort: '-created',
        $autoCancel: false
      });
      setProducts(result.items);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Failed to load catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['Health', 'Business', 'Marketing', 'Apparel'];

  return (
    <>
      <Helmet><title>Products - HGW Ecosystem</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 gradient-text">Product Catalog</h1>
                  <p className="text-muted-foreground">Premium wellness and business solutions</p>
                </div>
                <Button 
                  onClick={() => setIsCartOpen(true)} 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 relative"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10 glass-card"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  <Button 
                    variant={category === '' ? 'default' : 'outline'} 
                    onClick={() => setCategory('')}
                    className={category === '' ? 'bg-primary' : 'glass-card'}
                  >
                    All
                  </Button>
                  {categories.map(c => (
                    <Button 
                      key={c}
                      variant={category === c ? 'default' : 'outline'} 
                      onClick={() => setCategory(c)}
                      className={category === c ? 'bg-primary' : 'glass-card'}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="glass-card border-border/40 overflow-hidden">
                      <Skeleton className="h-48 w-full rounded-none" />
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-1/3 mt-4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <Card className="glass-card border-dashed p-12 text-center">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Filter className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <CardTitle>No products found</CardTitle>
                  <CardDescription>Try adjusting your search or filters.</CardDescription>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="glass-card-hover premium-shadow h-full flex flex-col overflow-hidden group">
                        <div className="relative h-48 bg-muted overflow-hidden flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={pb.files.getUrl(product, product.image)} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-6xl">📦</span>
                          )}
                          {product.category && (
                            <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                        <CardHeader className="p-4 pb-0">
                          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1 min-h-[40px]">
                            {product.description || 'No description available'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-4 flex-1 flex flex-col justify-end">
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-2xl font-bold gradient-text">
                              {formatCurrency(product.price)}
                            </span>
                            <Button 
                              onClick={() => addToCart(product)}
                              size="sm" 
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Cart Drawer/Modal (Simplified) */}
              <AnimatePresence>
                {isCartOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                      onClick={() => setIsCartOpen(false)}
                    />
                    <motion.div 
                      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="fixed inset-y-0 right-0 z-50 w-full max-w-md glass-card border-l border-border/50 shadow-2xl flex flex-col"
                    >
                      <div className="flex items-center justify-between p-6 border-b border-border/40">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5 text-primary" /> Shopping Cart
                        </h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {cart.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                            <ShoppingCart className="h-12 w-12 opacity-20" />
                            <p>Your cart is empty</p>
                            <Button variant="outline" onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
                          </div>
                        ) : (
                          cart.map(item => (
                            <div key={item.id} className="flex gap-4 items-center bg-background/50 p-3 rounded-xl border border-border/50">
                              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                {item.image ? (
                                  <img src={pb.files.getUrl(item, item.image)} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-2xl">📦</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                                <p className="text-primary font-medium text-sm">{formatCurrency(item.price)}</p>
                              </div>
                              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => updateQuantity(item.id, -1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => updateQuantity(item.id, 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {cart.length > 0 && (
                        <div className="p-6 border-t border-border/40 bg-background/50 backdrop-blur-xl space-y-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span className="gradient-text">{formatCurrency(cartTotal)}</span>
                          </div>
                          <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg shadow-primary/25">
                            Checkout
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;