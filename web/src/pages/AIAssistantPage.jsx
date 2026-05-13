import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageSquare, TrendingUp, Share2, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const AIAssistantPage = () => {
  const { currentUser } = useAuth();
  const scrollRef = useRef(null);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) return;
      try {
        const result = await pb.collection('ai_messages').getList(1, 100, {
          filter: `userId="${currentUser.id}"`,
          sort: 'timestamp',
          $autoCancel: false
        });
        
        const formatted = result.items.map(m => ({
          id: m.id,
          role: 'user',
          content: m.userMessage,
          response: m.aiResponse,
          timestamp: new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }));
        
        setMessages(formatted);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    };
    
    fetchMessages();
  }, [currentUser]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickActions = [
    { type: 'invitation_generator', icon: MessageSquare, title: 'Generate invitation', desc: 'Create personalized messages', color: 'from-cyan-500 to-blue-500' },
    { type: 'social_media', icon: Share2, title: 'Social media post', desc: 'Generate engaging content', color: 'from-purple-500 to-pink-500' },
    { type: 'business_analysis', icon: TrendingUp, title: 'Business analytics', desc: 'Analyze sales trends', color: 'from-emerald-500 to-teal-500' },
  ];

  const handleSendMessage = async (customMsg = null, type = 'general') => {
    const textToSend = customMsg || message.trim();
    if (!textToSend) return;

    // Optimistic UI update
    const optimisticId = `temp-${Date.now()}`;
    const newMsg = {
      id: optimisticId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isPending: true
    };
    
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    setIsTyping(true);

    try {
      // Create record in DB
      const record = await pb.collection('ai_messages').create({
        userId: currentUser.id,
        userMessage: textToSend,
        messageType: type,
        timestamp: new Date().toISOString(),
      }, { $autoCancel: false });

      // Mock AI delay & response logic based on type
      setTimeout(async () => {
        let aiResponseText = '';
        if (type === 'invitation_generator') aiResponseText = "Here is a professional invitation template: 'Hi [Name], I recently discovered an incredible wellness ecosystem called HGW that has completely transformed my approach to health and business. I would love to share a brief presentation with you...'";
        else if (type === 'social_media') aiResponseText = "🚀 Elevate your wellness journey with HGW! Discover premium products designed to harmonize mind and body. Click the link in my bio to explore the catalog! #Wellness #HGW #HealthyLiving";
        else if (type === 'business_analysis') aiResponseText = "Based on your recent metrics: Your retention rate is up 15% this month! To maintain this growth, consider following up with referrals who haven't ordered in the past 30 days. Would you like a list of those contacts?";
        else aiResponseText = `I understand you're asking about "${textToSend}". As an AI assistant for the HGW ecosystem, I recommend checking our Training Center for detailed guides on this topic. Is there a specific aspect you'd like me to explain further?`;

        // Update DB with AI response
        await pb.collection('ai_messages').update(record.id, {
          aiResponse: aiResponseText
        }, { $autoCancel: false });

        setMessages(prev => prev.map(m => m.id === optimisticId ? {
          ...m, 
          id: record.id, 
          response: aiResponseText, 
          isPending: false 
        } : m));
        
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      toast.error('Failed to send message');
      setIsTyping(false);
      setMessages(prev => prev.filter(m => m.id !== optimisticId));
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your chat history?")) return;
    try {
      // Need to delete individually since pocketbase doesn't have bulk delete via API easily without batch
      const items = await pb.collection('ai_messages').getFullList({ filter: `userId="${currentUser.id}"`, $autoCancel: false });
      await Promise.all(items.map(item => pb.collection('ai_messages').delete(item.id, { $autoCancel: false })));
      setMessages([]);
      toast.success('History cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  return (
    <>
      <Helmet><title>AI Assistant - HGW Ecosystem</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
              
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-bold mb-2 gradient-text">AI Assistant</h1>
                  <p className="text-muted-foreground">Your intelligent business companion</p>
                </div>
                <Button variant="outline" className="glass-card text-destructive hover:bg-destructive/10" onClick={handleClearHistory} disabled={messages.length === 0}>
                  <Trash2 className="h-4 w-4 mr-2" /> Clear History
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {quickActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.div key={action.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <Card className="glass-card-hover cursor-pointer border-border/40" onClick={() => handleSendMessage(`Generate ${action.title.toLowerCase()}`, action.type)}>
                        <CardHeader className="p-4 flex flex-row items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">{action.title}</CardTitle>
                            <CardDescription className="text-xs truncate">{action.desc}</CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <Card className="glass-card premium-shadow flex flex-col h-[600px] border-border/40">
                <CardHeader className="border-b border-border/40 py-4 bg-secondary/20">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    HGW Intelligence
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1 p-6">
                    {isLoading ? (
                      <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60 mt-20">
                        <MessageSquare className="h-16 w-16 mb-4" />
                        <p>How can I help you grow your business today?</p>
                      </div>
                    ) : (
                      <div className="space-y-6 pb-4">
                        {messages.map((msg) => (
                          <div key={msg.id} className="space-y-6">
                            {/* User Message */}
                            <div className="flex gap-3 justify-end">
                              <div className="max-w-[75%] rounded-2xl p-4 bg-primary text-primary-foreground shadow-lg">
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-[10px] opacity-70 mt-2 text-right">{msg.timestamp}</p>
                              </div>
                              <Avatar className="h-8 w-8 border-2 border-primary/50 shrink-0">
                                <AvatarFallback className="bg-secondary text-white text-xs">{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                            </div>
                            
                            {/* AI Response (if exists) */}
                            {msg.response && (
                              <div className="flex gap-3 justify-start">
                                <Avatar className="h-8 w-8 border-2 border-primary/50 shrink-0">
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold">AI</AvatarFallback>
                                </Avatar>
                                <div className="max-w-[75%] rounded-2xl p-4 glass-card border-border/40 shadow-md">
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.response}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex gap-3 justify-start">
                            <Avatar className="h-8 w-8 border-2 border-primary/50 shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold">AI</AvatarFallback>
                            </Avatar>
                            <div className="max-w-[75%] rounded-2xl p-4 glass-card border-border/40 shadow-md flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></span>
                              <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                              <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{animationDelay: '0.4s'}}></span>
                            </div>
                          </div>
                        )}
                        <div ref={scrollRef} />
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-4 border-t border-border/40 bg-background/50 backdrop-blur-md">
                    <form 
                      className="flex gap-2 relative" 
                      onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    >
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about products, compensation plans, or business advice..."
                        className="glass-card border-border/50 text-foreground placeholder:text-muted-foreground pr-12 h-12 rounded-xl focus-visible:ring-primary"
                        disabled={isTyping}
                      />
                      <Button
                        type="submit"
                        disabled={!message.trim() || isTyping}
                        className="absolute right-1 top-1 bottom-1 h-10 w-10 p-0 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>

            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AIAssistantPage;