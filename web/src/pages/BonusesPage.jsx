import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useCurrency } from '@/contexts/CurrencyContext.jsx';

const BonusesPage = () => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();

  return (
    <>
      <Helmet><title>{t('nav.bonuses')} - HGW</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold mb-8 gradient-text">{t('nav.bonuses')}</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card premium-shadow">
                   <CardHeader><CardTitle className="text-muted-foreground text-sm">Total</CardTitle></CardHeader>
                   <CardContent><p className="text-3xl font-bold">{formatCurrency(8420)}</p></CardContent>
                </Card>
                <Card className="glass-card premium-shadow">
                   <CardHeader><CardTitle className="text-muted-foreground text-sm">Pending</CardTitle></CardHeader>
                   <CardContent><p className="text-3xl font-bold text-amber-500">{formatCurrency(1240)}</p></CardContent>
                </Card>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};
export default BonusesPage;