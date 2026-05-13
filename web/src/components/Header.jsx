import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Settings, User, LogOut, ChevronDown, Sun, Moon, Globe, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useCurrency } from '@/contexts/CurrencyContext.jsx';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const languages = [
    { code: 'en', name: 'English' }, { code: 'es', name: 'Español' }, { code: 'pt', name: 'Português' },
    { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' }, { code: 'it', name: 'Italiano' }, { code: 'nl', name: 'Nederlands' }
  ];

  const currencies = ['USD', 'MXN', 'PEN', 'ARS', 'COP', 'BRL', 'CLP', 'EUR', 'GBP', 'CAD', 'AUD'];

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/40">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <span className="text-white font-bold text-sm">HGW</span>
            </div>
            <span className="font-bold text-lg gradient-text hidden md:block">HGW Ecosystem</span>
          </Link>
          <div className="hidden md:flex items-center flex-1 max-w-md ml-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder={t('common.search') + "..."} className="pl-10 glass-card border-border/40 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-muted/50">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card">
              {languages.map(lang => (
                <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)} className={language === lang.code ? "bg-primary/10 text-primary" : ""}>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <DollarSign className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card max-h-[300px] overflow-auto">
              {currencies.map(curr => (
                <DropdownMenuItem key={curr} onClick={() => setCurrency(curr)} className={currency === curr ? "bg-primary/10 text-primary" : ""}>
                  {curr}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted/50">
                <Avatar className="h-8 w-8 border-2 border-primary/50">
                  <AvatarImage src="" alt="Maya Chen" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">MC</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-border/40">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" /><span>{t('nav.settings')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" /><span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;