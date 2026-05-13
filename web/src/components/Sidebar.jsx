import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, UserPlus, Package, ShoppingCart, DollarSign, Trophy, Bot, GraduationCap, Settings, Code, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
    { path: '/team-members', icon: Users, label: 'nav.team' },
    { path: '/referrals', icon: UserPlus, label: 'nav.referrals' },
    { path: '/products', icon: Package, label: 'nav.products' },
    { path: '/orders', icon: ShoppingCart, label: 'nav.orders' },
    { path: '/bonuses', icon: DollarSign, label: 'nav.bonuses' },
    { path: '/rankings', icon: Trophy, label: 'nav.rankings' },
    { path: '/ai-assistant', icon: Bot, label: 'nav.ai' },
    { path: '/training-center', icon: GraduationCap, label: 'nav.training' },
    { path: '/api-documentation', icon: Code, label: 'nav.api' },
  ];

  const containerVariants = {
    expanded: { width: '280px', transition: { duration: 0.3, ease: "easeInOut" } },
    collapsed: { width: '80px', transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  return (
    <motion.aside
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={containerVariants}
      className={cn(
        "glass-card fixed left-4 top-24 bottom-4 z-40 rounded-2xl flex flex-col premium-shadow overflow-hidden",
        "border border-border/50 backdrop-blur-xl"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border/30">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-bold text-lg tracking-tight gradient-text">
              Menu
            </motion.div>
          )}
        </AnimatePresence>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="hover:bg-primary/20 hover:text-primary transition-all rounded-xl ml-auto">
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.div key={item.path} custom={i} initial="hidden" animate="visible" variants={itemVariants}>
              <Link to={item.path} className={cn('group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative', isActive ? 'bg-primary/10 text-primary neon-accent' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground')}>
                {isActive && <motion.div layoutId="active-nav" className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md glow-effect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />}
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={cn("flex-shrink-0", isActive && "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]")}>
                  <Icon className="h-5 w-5" />
                </motion.div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="font-medium whitespace-nowrap overflow-hidden">
                      {t(item.label)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/30">
        <Link to="/settings" className={cn('group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300', location.pathname === '/settings' ? 'bg-primary/10 text-primary neon-accent' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground')}>
          <motion.div whileHover={{ scale: 1.1, rotate: 90 }}><Settings className="h-5 w-5" /></motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="font-medium whitespace-nowrap overflow-hidden">
                {t('nav.settings')}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;