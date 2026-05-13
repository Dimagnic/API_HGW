import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Copy, Check, Key, Terminal, Server, Activity, Search, Shield, Webhook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Sidebar from '@/components/Sidebar.jsx';

const APIDocumentationPage = () => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('javascript');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast('Copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'auth', title: 'Authentication', icon: Shield },
    { id: 'members', title: 'Team Members', icon: Server },
    { id: 'webhooks', title: 'Webhooks', icon: Webhook },
  ];

  const codeExamples = {
    javascript: `// Initialize HGW Client
import { HGWClient } from '@hgw/sdk';

const client = new HGWClient('sk_live_12345');

// Fetch team members
async function getTeam() {
  try {
    const members = await client.team.list({ limit: 10 });
    console.log(members.data);
  } catch (err) {
    console.error('API Error:', err.message);
  }
}`,
    python: `import hgw

client = hgw.Client('sk_live_12345')

# Fetch team members
try:
    members = client.team.list(limit=10)
    print(members.data)
except hgw.error.APIError as e:
    print(f"API Error: {e}")`,
    curl: `curl -X GET https://api.hgw.eco/v1/team/members \\
  -H "Authorization: Bearer sk_live_12345" \\
  -d limit=10`,
  };

  const responseJson = `{
  "object": "list",
  "data": [
    {
      "id": "mem_8xjs29dk",
      "object": "member",
      "name": "Raj Patel",
      "rank": "Diamond",
      "created": 1715610000
    }
  ],
  "has_more": false
}`;

  return (
    <>
      <Helmet>
        <title>API Documentation - HGW Developers</title>
      </Helmet>

      <div className="min-h-screen bg-background relative">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-4 lg:ml-80 mr-4 mt-8 mb-8 transition-all duration-300">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-[1600px] mx-auto"
            >
              {/* Top Hero Section */}
              <div className="flex flex-col md:flex-row gap-8 justify-between items-center mb-12">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight gradient-text mb-4">API Reference</h1>
                  <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
                    Integrate the HGW Ecosystem directly into your application. Our REST API is designed to be predictable, resource-oriented, and easy to use.
                  </p>
                </div>
                <div className="w-full md:w-96 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search endpoints, guides..." 
                    className="pl-12 py-6 glass-card border-border/40 focus:border-primary rounded-xl w-full text-base premium-shadow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <kbd className="bg-muted px-2 py-1 rounded text-xs font-mono">⌘</kbd>
                    <kbd className="bg-muted px-2 py-1 rounded text-xs font-mono">K</kbd>
                  </div>
                </div>
              </div>

              {/* Stripe-style 2-Column Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_600px] gap-8">
                
                {/* Left Column: Content */}
                <div className="space-y-16">
                  
                  {/* Authentication Section */}
                  <section id="auth" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-bold">Authentication</h2>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Authenticate your API requests by providing your secret key in the Authorization header. You can manage your API keys in the developer dashboard.
                    </p>
                    
                    <Card className="glass-card border-border/40 premium-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Your Secret Key</h3>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Live Mode</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-background/50 border border-border/50 rounded-lg p-3 font-mono text-sm tracking-widest text-primary blur-[4px] hover:blur-none transition-all duration-300 cursor-pointer">
                            sk_live_hgw_8f29d7c4a1b5e6...
                          </div>
                          <Button variant="outline" className="glass-card border-border/40" onClick={() => handleCopy('sk_live_hgw_8f29d7c4a1b5e6', 'key')}>
                            {copiedCode === 'key' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-rose-400 mt-3 flex items-center gap-1">
                          <Shield className="h-3 w-3" /> Never share your secret key in client-side code.
                        </p>
                      </CardContent>
                    </Card>
                  </section>

                  {/* Team Members Section */}
                  <section id="members" className="scroll-mt-32 pt-8 border-t border-border/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Server className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-bold">List Team Members</h2>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Returns a list of your team members. The members are returned sorted by creation date, with the most recently created members appearing first.
                    </p>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Endpoint</h4>
                      <div className="flex items-center gap-3 bg-background/50 border border-border/50 p-3 rounded-lg w-fit">
                        <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">GET</Badge>
                        <span className="font-mono text-sm">https://api.hgw.eco/v1/team/members</span>
                      </div>

                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mt-8">Parameters</h4>
                      <div className="border border-border/30 rounded-xl overflow-hidden glass-card">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-secondary/40">
                            <tr>
                              <th className="px-6 py-4 font-medium">Name</th>
                              <th className="px-6 py-4 font-medium">Type</th>
                              <th className="px-6 py-4 font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/30">
                            <tr>
                              <td className="px-6 py-4 font-mono text-primary">limit</td>
                              <td className="px-6 py-4 text-muted-foreground">integer</td>
                              <td className="px-6 py-4">A limit on the number of objects to be returned. Limit can range between 1 and 100.</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 font-mono text-primary">starting_after</td>
                              <td className="px-6 py-4 text-muted-foreground">string</td>
                              <td className="px-6 py-4">A cursor for use in pagination.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                </div>

                {/* Right Column: Sticky Code Examples */}
                <div className="hidden xl:block">
                  <div className="sticky top-24 space-y-6">
                    
                    {/* Request Panel */}
                    <Card className="glass-card border-border/40 premium-shadow bg-secondary/80 backdrop-blur-xl overflow-hidden border-t-2 border-t-primary/50">
                      <div className="flex items-center justify-between px-4 py-2 bg-background/40 border-b border-border/30">
                        <div className="flex gap-2">
                          {['javascript', 'python', 'curl'].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setActiveTab(lang)}
                              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                                activeTab === lang ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {lang.toUpperCase()}
                            </button>
                          ))}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => handleCopy(codeExamples[activeTab], 'req')}>
                          {copiedCode === 'req' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <div className="p-4 text-sm font-mono custom-scrollbar max-h-[300px] overflow-auto">
                        <SyntaxHighlighter language={activeTab === 'curl' ? 'bash' : activeTab} style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0, padding: 0 }}>
                          {codeExamples[activeTab]}
                        </SyntaxHighlighter>
                      </div>
                    </Card>

                    {/* Response Panel */}
                    <Card className="glass-card border-border/40 premium-shadow bg-secondary/80 backdrop-blur-xl overflow-hidden border-t-2 border-t-emerald-500/50">
                      <div className="flex items-center justify-between px-4 py-2 bg-background/40 border-b border-border/30">
                        <span className="text-xs font-medium text-emerald-400 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          RESPONSE (200 OK)
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => handleCopy(responseJson, 'res')}>
                          {copiedCode === 'res' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <div className="p-4 text-sm font-mono custom-scrollbar max-h-[400px] overflow-auto">
                        <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0, padding: 0 }}>
                          {responseJson}
                        </SyntaxHighlighter>
                      </div>
                    </Card>

                  </div>
                </div>

              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default APIDocumentationPage;