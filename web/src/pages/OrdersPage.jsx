import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Download, Truck, Package, Clock, Filter, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCurrency } from '@/contexts/CurrencyContext.jsx';
import { useDebounce } from '@/hooks/useDebounce.js';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const OrdersPage = () => {
  const { formatCurrency } = useCurrency();
  const { currentUser } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let filterStr = `userId="${currentUser.id}"`;
      if (debouncedSearch) {
        filterStr += ` && id ~ "${debouncedSearch}"`;
      }
      if (statusFilter) {
        filterStr += ` && status="${statusFilter}"`;
      }

      const result = await pb.collection('orders').getList(1, 50, {
        filter: filterStr,
        sort: '-created',
        $autoCancel: false
      });
      setOrders(result.items);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Could not load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchOrders();
  }, [currentUser, debouncedSearch, statusFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      shipped: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    };
    return (
      <Badge variant="outline" className={`capitalize ${styles[status] || 'bg-muted text-muted-foreground'}`}>
        {status}
      </Badge>
    );
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <>
      <Helmet><title>Orders - HGW Ecosystem</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 gradient-text text-balance">Order History</h1>
                  <p className="text-muted-foreground">Track and manage your purchases</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search by Order ID..." 
                    className="pl-10 glass-card" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  <Button 
                    variant={statusFilter === '' ? 'default' : 'outline'} 
                    onClick={() => setStatusFilter('')}
                    className={statusFilter === '' ? 'bg-primary' : 'glass-card'}
                  >
                    All
                  </Button>
                  {statuses.map(status => (
                    <Button 
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'} 
                      onClick={() => setStatusFilter(status)}
                      className={`capitalize ${statusFilter === status ? 'bg-primary' : 'glass-card'}`}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              <Card className="glass-card premium-shadow overflow-hidden border-border/40">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-8 space-y-4">
                      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
                      <Package className="h-12 w-12 mb-4 opacity-20" />
                      <h3 className="text-lg font-semibold text-foreground mb-1">No orders found</h3>
                      <p>You don't have any orders matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-secondary/20">
                          <TableRow className="border-border/40 hover:bg-transparent">
                            <TableHead className="font-semibold">Order ID</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Items</TableHead>
                            <TableHead className="font-semibold">Total</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => {
                            const itemCount = Array.isArray(order.items) ? order.items.length : 0;
                            return (
                              <TableRow key={order.id} className="border-border/20 hover:bg-muted/30 transition-colors">
                                <TableCell className="font-mono text-xs font-medium">{order.id}</TableCell>
                                <TableCell className="text-sm">
                                  {new Date(order.created).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{itemCount} items</TableCell>
                                <TableCell className="font-semibold gradient-text">{formatCurrency(order.totalAmount)}</TableCell>
                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)} className="hover:bg-primary/10 hover:text-primary">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Detail Modal */}
              <AnimatePresence>
                {selectedOrder && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-2xl max-h-[90vh] flex flex-col"
                    >
                      <Card className="glass-card shadow-2xl border-primary/20 flex flex-col h-full overflow-hidden">
                        <CardHeader className="bg-secondary/40 border-b border-border/40 pb-4 flex flex-row justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                              Order Details
                              {getStatusBadge(selectedOrder.status)}
                            </CardTitle>
                            <CardDescription className="font-mono mt-1 text-xs opacity-70">ID: {selectedOrder.id}</CardDescription>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="h-8 w-8 rounded-full bg-background/50 hover:bg-destructive/20 hover:text-destructive shrink-0">✕</Button>
                        </CardHeader>
                        
                        <CardContent className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
                          {/* Order items would be mapped here. Since it's JSON in PB, we handle it defensively */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Package className="h-4 w-4"/> Items</h3>
                            <div className="bg-background/50 rounded-xl border border-border/40 divide-y divide-border/20">
                              {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                                selectedOrder.items.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center p-3 text-sm">
                                    <div>
                                      <span className="font-medium">{item.name || 'Unknown Product'}</span>
                                      <span className="text-muted-foreground ml-2">x{item.quantity || 1}</span>
                                    </div>
                                    <span className="font-mono">{formatCurrency(item.price * (item.quantity || 1))}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="p-3 text-sm text-muted-foreground">Items data unavailable</div>
                              )}
                              <div className="flex justify-between items-center p-3 font-bold bg-primary/5">
                                <span>Total</span>
                                <span className="gradient-text text-lg">{formatCurrency(selectedOrder.totalAmount)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Truck className="h-4 w-4"/> Tracking</h3>
                              <div className="bg-background/50 p-4 rounded-xl border border-border/40 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Method:</span> <span className="font-medium">{selectedOrder.paymentMethod || 'Standard'}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Number:</span> <span className="font-mono">{selectedOrder.trackingNumber || 'Pending'}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Est. Delivery:</span> <span>{selectedOrder.estimatedDelivery ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString() : 'TBD'}</span></div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4"/> Timeline</h3>
                              <div className="bg-background/50 p-4 rounded-xl border border-border/40 relative">
                                <div className="absolute left-6 top-6 bottom-6 w-px bg-border/50"></div>
                                <div className="space-y-4 relative">
                                  <div className="flex gap-4">
                                    <div className="w-4 h-4 rounded-full bg-primary relative z-10 ring-4 ring-background"></div>
                                    <div className="flex-1 -mt-1 text-sm">
                                      <p className="font-medium">Order Placed</p>
                                      <p className="text-xs text-muted-foreground">{new Date(selectedOrder.created).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  {selectedOrder.status !== 'pending' && (
                                    <div className="flex gap-4">
                                      <div className="w-4 h-4 rounded-full bg-emerald-500 relative z-10 ring-4 ring-background"></div>
                                      <div className="flex-1 -mt-1 text-sm">
                                        <p className="font-medium capitalize">Status: {selectedOrder.status}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(selectedOrder.updated).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        
                        <div className="p-4 border-t border-border/40 bg-secondary/20 flex justify-end gap-2 shrink-0">
                          <Button variant="outline" className="glass-card" onClick={() => toast('Receipt download started')}><Download className="h-4 w-4 mr-2" /> Receipt</Button>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;