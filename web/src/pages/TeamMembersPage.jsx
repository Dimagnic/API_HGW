import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Copy, Check, Loader2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useCurrency } from '@/contexts/CurrencyContext.jsx';
import { useDebounce } from '@/hooks/useDebounce.js';

const TeamMembersPage = () => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { currentUser } = useAuth();
  
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [copiedId, setCopiedId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', position: '', status: 'active' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      let filterStr = `userId="${currentUser.id}"`;
      if (debouncedSearch) {
        filterStr += ` && (name ~ "${debouncedSearch}" || email ~ "${debouncedSearch}")`;
      }
      
      const result = await pb.collection('team_members').getList(1, 50, {
        filter: filterStr,
        sort: '-created',
        $autoCancel: false
      });
      setMembers(result.items);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchMembers();
  }, [currentUser, debouncedSearch]);

  const handleCopy = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success('Referral link copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await pb.collection('team_members').delete(id, { $autoCancel: false });
      toast.success('Member removed');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        userId: currentUser.id,
        referralCode: editingMember ? editingMember.referralCode : crypto.randomUUID().substring(0, 8),
      };

      if (editingMember) {
        await pb.collection('team_members').update(editingMember.id, data, { $autoCancel: false });
        toast.success('Member updated');
      } else {
        await pb.collection('team_members').create(data, { $autoCancel: false });
        toast.success('Member added');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({ name: member.name, email: member.email, position: member.position, status: member.status });
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', position: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Helmet><title>Team Members - HGW</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 gradient-text">Team Members</h1>
                  <p className="text-muted-foreground">Manage your downline and track performance</p>
                </div>
                <Button onClick={() => openModal()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" /> Add Member
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search by name or email..." 
                    className="pl-10 glass-card" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="glass-card"><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
                  ))}
                </div>
              ) : members.length === 0 ? (
                <Card className="glass-card border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="mb-2">No members found</CardTitle>
                    <CardDescription>Try adjusting your search or add a new team member.</CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((m) => (
                    <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="glass-card-hover premium-shadow h-full flex flex-col relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${m.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                        <CardHeader className="flex flex-row justify-between items-start pb-2">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {m.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{m.name}</CardTitle>
                              <CardDescription className="truncate max-w-[180px]">{m.email}</CardDescription>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="-mr-2 -mt-2"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-card">
                              <DropdownMenuItem onClick={() => openModal(m)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(m.id)} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between pt-4">
                          <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Position</p>
                              <p className="font-medium text-sm">{m.position || 'Member'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                              <Badge variant="outline" className={m.status === 'active' ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : ""}>
                                {m.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Orders</p>
                              <p className="font-semibold">{m.totalOrders || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Revenue</p>
                              <p className="font-semibold text-primary">{formatCurrency(m.totalRevenue || 0)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/40">
                            <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 font-mono text-xs truncate">
                              {m.referralCode || 'No code'}
                            </div>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => handleCopy(`https://hgw.eco/ref/${m.referralCode}`, m.id)}
                            >
                              {copiedId === m.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Simple Modal Implementation */}
              <AnimatePresence>
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="w-full max-w-md"
                    >
                      <Card className="glass-card shadow-2xl border-primary/20">
                        <form onSubmit={handleSubmit}>
                          <CardHeader>
                            <CardTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Name</label>
                              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Email</label>
                              <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Position/Rank</label>
                              <Input value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="bg-background/50" placeholder="e.g. Diamond Consultant" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Status</label>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.status} 
                                onChange={e => setFormData({...formData, status: e.target.value})}
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </CardContent>
                          <CardContent className="flex justify-end gap-2 pt-0">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              {editingMember ? 'Update' : 'Add'} Member
                            </Button>
                          </CardContent>
                        </form>
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

export default TeamMembersPage;