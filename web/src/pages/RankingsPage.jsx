import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const RankingsPage = () => {
  const { t } = useLanguage();
  return (
    <>
      <Helmet><title>{t('nav.rankings')} - HGW</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold mb-8 gradient-text">{t('nav.rankings')}</h1>
              <Card className="glass-card premium-shadow">
                <CardHeader><CardTitle>Your Rank: Diamond</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">73% to Elite Diamond</p></CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};
export default RankingsPage;