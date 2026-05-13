import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Palette, Globe, DollarSign, Shield, Bell, Key, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useCurrency } from '@/contexts/CurrencyContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, rates } = useCurrency();
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [passData, setPassData] = useState({ oldPassword: '', password: '', passwordConfirm: '' });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await pb.collection('users').update(currentUser.id, profileData, { $autoCancel: false });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passData.password !== passData.passwordConfirm) {
      toast.error("Passwords don't match");
      return;
    }
    setIsLoading(true);
    try {
      await pb.collection('users').update(currentUser.id, passData, { $autoCancel: false });
      toast.success('Password updated successfully');
      setPassData({ oldPassword: '', password: '', passwordConfirm: '' });
    } catch (err) {
      toast.error('Failed to update password. Check old password.');
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English' }, { code: 'es', name: 'Español' }, { code: 'pt', name: 'Português' },
    { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' }, { code: 'it', name: 'Italiano' }, { code: 'nl', name: 'Nederlands' }
  ];

  const currencies = ['USD', 'MXN', 'PEN', 'ARS', 'COP', 'BRL', 'CLP', 'EUR', 'GBP', 'CAD', 'AUD'];

  return (
    <>
      <Helmet><title>Settings - HGW Ecosystem</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto space-y-8">
              
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 gradient-text text-balance">Account Settings</h1>
                <p className="text-muted-foreground">Manage your profile, security, and preferences</p>
              </div>

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="glass-card border-border/40 p-1 flex-wrap h-auto gap-1">
                  <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
                  <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-primary"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
                  <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-primary"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
                  <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-primary"><Palette className="h-4 w-4 mr-2" />Appearance</TabsTrigger>
                </TabsList>

                {/* PROFILE TAB */}
                <TabsContent value="profile" className="m-0">
                  <Card className="glass-card border-border/40 premium-shadow">
                    <form onSubmit={handleProfileUpdate}>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your basic profile details.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 max-w-2xl">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input className="glass-card border-border/50 text-foreground" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <Input type="email" className="glass-card border-border/50 text-foreground" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <Input type="tel" className="glass-card border-border/50 text-foreground" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                        </div>
                      </CardContent>
                      <CardFooter className="bg-secondary/10 border-t border-border/20 py-4">
                        <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">
                          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                          Save Changes
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>

                {/* SECURITY TAB */}
                <TabsContent value="security" className="m-0">
                  <div className="space-y-6">
                    <Card className="glass-card border-border/40 premium-shadow">
                      <form onSubmit={handlePasswordUpdate}>
                        <CardHeader>
                          <CardTitle>Change Password</CardTitle>
                          <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-w-2xl">
                          <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input type="password" required className="glass-card border-border/50 text-foreground" value={passData.oldPassword} onChange={e => setPassData({...passData, oldPassword: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input type="password" required minLength={8} className="glass-card border-border/50 text-foreground" value={passData.password} onChange={e => setPassData({...passData, password: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input type="password" required minLength={8} className="glass-card border-border/50 text-foreground" value={passData.passwordConfirm} onChange={e => setPassData({...passData, passwordConfirm: e.target.value})} />
                          </div>
                        </CardContent>
                        <CardFooter className="bg-secondary/10 border-t border-border/20 py-4">
                          <Button type="submit" disabled={isLoading} variant="outline" className="glass-card border-primary/30 hover:bg-primary hover:text-primary-foreground">
                            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                            Update Password
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>

                    <Card className="glass-card border-destructive/20 shadow-lg shadow-destructive/5">
                      <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <Button variant="destructive" onClick={() => window.confirm('Are you absolutely sure? This cannot be undone.')}>Delete Account</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* NOTIFICATIONS TAB */}
                <TabsContent value="notifications" className="m-0">
                  <Card className="glass-card border-border/40 premium-shadow">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose what alerts you want to receive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 max-w-2xl">
                      <div className="flex items-center justify-between p-4 glass-card rounded-xl border-border/50">
                        <div className="space-y-0.5">
                          <Label className="text-base font-semibold">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive daily summaries and important alerts via email.</p>
                        </div>
                        <Switch defaultChecked onCheckedChange={(val) => toast.success(`Email notifications ${val ? 'enabled' : 'disabled'}`)} />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 glass-card rounded-xl border-border/50">
                        <div className="space-y-0.5">
                          <Label className="text-base font-semibold">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive real-time alerts in your browser.</p>
                        </div>
                        <Switch onCheckedChange={(val) => toast.success(`Push notifications ${val ? 'enabled' : 'disabled'}`)} />
                      </div>

                      <div className="space-y-2 p-4 glass-card rounded-xl border-border/50">
                        <Label className="text-base font-semibold">Activity Summary Frequency</Label>
                        <Select defaultValue="daily" onValueChange={(val) => toast.success(`Frequency set to ${val}`)}>
                          <SelectTrigger className="w-full sm:w-[200px] glass-card text-foreground">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="glass-card">
                            <SelectItem value="instant">Instant</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* APPEARANCE TAB */}
                <TabsContent value="appearance" className="m-0 space-y-6">
                  <Card className="glass-card border-border/40 premium-shadow">
                    <CardHeader>
                      <CardTitle>{t('settings.theme')}</CardTitle>
                      <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
                        <div onClick={() => setTheme('dark')} className={`glass-card p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'dark' ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent hover:border-border'}`}>
                          <div className="w-full h-24 bg-[#0a0a0a] rounded-lg mb-3 border border-white/10 flex flex-col gap-2 p-2">
                            <div className="w-full h-3 bg-white/10 rounded"></div>
                            <div className="flex gap-2 h-full"><div className="w-1/3 h-full bg-white/5 rounded"></div><div className="w-2/3 h-full bg-white/5 rounded"></div></div>
                          </div>
                          <p className="text-sm font-semibold text-center flex items-center justify-center gap-2">Dark {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-primary" />}</p>
                        </div>
                        <div onClick={() => setTheme('light')} className={`glass-card p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'light' ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent hover:border-border'}`}>
                          <div className="w-full h-24 bg-white rounded-lg mb-3 border border-slate-200 flex flex-col gap-2 p-2 shadow-sm">
                            <div className="w-full h-3 bg-slate-100 rounded"></div>
                            <div className="flex gap-2 h-full"><div className="w-1/3 h-full bg-slate-50 rounded"></div><div className="w-2/3 h-full bg-slate-50 rounded"></div></div>
                          </div>
                          <p className="text-sm font-semibold text-center flex items-center justify-center gap-2">Light {theme === 'light' && <div className="w-2 h-2 rounded-full bg-primary" />}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="glass-card border-border/40 premium-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Language</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {languages.map(lang => (
                            <Button 
                              key={lang.code} 
                              variant={language === lang.code ? "default" : "outline"}
                              className={`justify-between ${language === lang.code ? "bg-primary text-primary-foreground" : "glass-card text-foreground"}`}
                              onClick={() => setLanguage(lang.code)}
                            >
                              <span>{lang.name}</span>
                              <span className="text-xs opacity-50 uppercase">{lang.code}</span>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card border-border/40 premium-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Currency</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="w-full glass-card text-foreground border-border/50">
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-border/50">
                            {currencies.map(curr => (
                              <SelectItem key={curr} value={curr}>
                                <div className="flex justify-between items-center w-[200px]">
                                  <span className="font-bold">{curr}</span>
                                  <span className="text-muted-foreground text-xs font-mono border-l border-border/50 pl-2">Rate: {rates[curr]}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

              </Tabs>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;