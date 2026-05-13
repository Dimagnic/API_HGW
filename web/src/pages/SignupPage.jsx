import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup(formData);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Sign Up - HGW Ecosystem</title></Helmet>
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background py-12">
        <div className="absolute inset-0 z-0">
          <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join the HGW Ecosystem today</p>
          </div>

          <Card className="glass-card border-border/40 premium-shadow">
            <form onSubmit={handleSignup}>
              <CardContent className="pt-8 space-y-4">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="name" placeholder="John Doe" className="pl-10 bg-background/50 border-border/50 text-foreground" value={formData.name} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="email" type="email" placeholder="name@company.com" className="pl-10 bg-background/50 border-border/50 text-foreground" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 bg-background/50 border-border/50 text-foreground" value={formData.password} onChange={handleChange} required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="passwordConfirm" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 bg-background/50 border-border/50 text-foreground" value={formData.passwordConfirm} onChange={handleChange} required minLength={8} />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pb-8">
                <Button type="submit" className="w-full bg-primary text-primary-foreground h-12" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign Up <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  );
};
export default SignupPage;