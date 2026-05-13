import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Wallet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useCurrency } from '@/contexts/CurrencyContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const DashboardPage = () => {
  const { t } = useLanguage();
  const { formatCurrency, rates, currency } = useCurrency();
  const { currentUser } = useAuth();
  const rate = rates[currency] || 1;

  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch user stats
        const userStats = await pb.collection('user_stats').getFirstListItem(`userId="${currentUser.id}"`, { $autoCancel: false }).catch(() => null);
        
        // Fetch recent activity
        const recentActivity = await pb.collection('activity_feed').getList(1, 5, {
          filter: `userId="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });

        setStats(userStats || {
          totalRevenue: 0,
          totalTeamSize: 0,
          totalSalesVolume: 0
        });
        setActivities(recentActivity.items);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const chartData = [
    { month: 'Jan', revenue: 45000 * rate, volume: 120000 * rate },
    { month: 'Feb', revenue: 52000 * rate, volume: 135000 * rate },
    { month: 'Mar', revenue: 48000 * rate, volume: 125000 * rate },
    { month: 'Apr', revenue: 61000 * rate, volume: 150000 * rate },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('nav.dashboard')} - HGW</title>
      </Helmet>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight gradient-text-gold mb-1">{t('dashboard.title')}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span></span>
                    {t('dashboard.subtitle')}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('dashboard.balance')}</p>
                      <p className="font-semibold font-mono">{formatCurrency(stats?.totalRevenue || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <motion.div className="md:col-span-2 lg:col-span-3">
                  <Card className="glass-card border-border/40 premium-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-lg font-semibold">{t('dashboard.revenue')}</CardTitle>
                        <CardDescription>{t('dashboard.revenueDesc')}</CardDescription>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />+18.4%
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} tickFormatter={val => formatCurrency(val/rate/1000).split('.')[0] + 'k'} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', borderColor: 'var(--border)' }} formatter={val => [formatCurrency(val/rate), t('dashboard.revenue')]} />
                            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-1">
                  <Card className="glass-card border-border/40 overflow-hidden relative group">
                    <CardHeader className="pb-2">
                      <CardDescription>{t('dashboard.network')}</CardDescription>
                      <CardTitle className="text-3xl font-bold">{stats?.totalTeamSize || 0}</CardTitle>
                    </CardHeader>
                    <CardContent><div className="text-sm text-emerald-500 flex items-center"><ArrowUpRight className="h-4 w-4" /> Active</div></CardContent>
                  </Card>
                  <Card className="glass-card border-border/40 bg-gradient-to-br from-secondary/10 to-primary/5">
                    <CardHeader className="pb-2">
                      <CardDescription>{t('dashboard.volume')}</CardDescription>
                      <CardTitle className="text-3xl font-bold gradient-text">{formatCurrency(stats?.totalSalesVolume || 0)}</CardTitle>
                    </CardHeader>
                    <CardContent><div className="text-sm text-emerald-500 flex items-center"><ArrowUpRight className="h-4 w-4" /> Growth</div></CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-border/40 premium-shadow h-full">
                  <CardHeader>
                    <CardTitle>{t('dashboard.activity')}</CardTitle>
                    <CardDescription>{t('dashboard.activityDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activities.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No recent activity</p>
                    ) : (
                      activities.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-border/20 bg-background/50">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                              <Activity className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tx.activityType.replace('_', ' ')}</p>
                              <p className="text-xs text-muted-foreground">{new Date(tx.created).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/40 premium-shadow h-full">
                  <CardHeader>
                    <CardTitle>{t('dashboard.chartVol')}</CardTitle>
                    <CardDescription>{t('dashboard.chartVolDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={val => formatCurrency(val/rate/1000).split('.')[0] + 'k'} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', borderColor: 'var(--border)' }} formatter={val => [formatCurrency(val/rate), t('dashboard.volume')]} />
                          <Bar dataKey="volume" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;