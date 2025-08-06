
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { LandingPageData, TeamMember, RoadmapItem } from '../../server/src/schema';

function App() {
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadLandingData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getLandingPageData.query();
      setLandingData(result);
    } catch (error) {
      console.error('Failed to load landing page data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLandingData();
  }, [loadLandingData]);

  if (isLoading || !landingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950" 
           style={{ background: `linear-gradient(135deg, #1a1a2e, #16213e, #0f3460), linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)` }}>
        <div className="text-white text-xl">Loading ultaCoin...</div>
      </div>
    );
  }

  const { branding, content, teamMembers, roadmapItems } = landingData;
  const primaryColor = branding.primary_color;
  const secondaryColor = branding.secondary_color;
  const accentColor = branding.accent_color;

  // Find specific content sections or provide defaults
  const aboutContent = content.find(c => c.section_name === 'about') || {
    title: "About ultaCoin",
    content: "ultaCoin represents the next generation of decentralized digital currency, built on cutting-edge blockchain technology. Our mission is to create a fast, secure, and scalable cryptocurrency that empowers users worldwide with true financial freedom and innovation."
  };

  const featuresContent = content.filter(c => c.section_name === 'features');
  const keyFeatures = featuresContent.length > 0 ? featuresContent.map(f => ({
    title: f.title,
    description: f.content
  })) : [
    {
      title: "⚡ Lightning Fast",
      description: "Transaction speeds up to 65,000 TPS with sub-second finality"
    },
    {
      title: "🔒 Ultra Secure",
      description: "Advanced cryptography and proven consensus mechanisms"
    },
    {
      title: "🌱 Eco-Friendly",
      description: "Energy-efficient proof-of-stake with minimal environmental impact"
    },
    {
      title: "💎 Low Fees",
      description: "Transaction costs under $0.01 for maximum accessibility"
    },
    {
      title: "🔗 Interoperable",
      description: "Seamless cross-chain compatibility and bridge solutions"
    },
    {
      title: "🏗️ Developer-First",
      description: "Comprehensive tooling and documentation for builders"
    }
  ];

  const tokenomicsContent = content.find(c => c.section_name === 'tokenomics');
  const tokenomicsData = [
    { label: "Total Supply", value: "1,000,000,000 ULTA" },
    { label: "Circulating Supply", value: "400,000,000 ULTA" },
    { label: "Market Cap", value: "$125,000,000" },
    { label: "Public Sale", value: "40%" },
    { label: "Team & Advisors", value: "20%" },
    { label: "Development", value: "25%" },
    { label: "Marketing", value: "10%" },
    { label: "Reserve Fund", value: "5%" }
  ];

  // Handle roadmap items with proper typing
  const activeRoadmapItems: RoadmapItem[] = roadmapItems
    .filter(item => item.is_active)
    .sort((a, b) => a.order_index - b.order_index);

  const displayRoadmapItems = activeRoadmapItems.length > 0 ? activeRoadmapItems : [
    {
      id: 1,
      quarter: "Q1 2024",
      year: 2024,
      title: "Platform Launch",
      status: "completed" as const,
      description: "Launch of core platform",
      order_index: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      quarter: "Q2 2024",
      year: 2024,
      title: "DeFi Integration",
      status: "in_progress" as const,
      description: "Integration with DeFi protocols",
      order_index: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      quarter: "Q3 2024",
      year: 2024,
      title: "Mobile App",
      status: "planned" as const,
      description: "Mobile application release",
      order_index: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      quarter: "Q4 2024",
      year: 2024,
      title: "Cross-Chain Bridges",
      status: "planned" as const,
      description: "Cross-chain functionality",
      order_index: 4,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  // Handle team members with proper typing
  const activeTeamMembers: TeamMember[] = teamMembers
    .filter(member => member.is_active)
    .sort((a, b) => a.order_index - b.order_index);

  const displayTeamMembers = activeTeamMembers.length > 0 ? activeTeamMembers : [
    {
      id: 1,
      name: "Alex Chen",
      position: "CEO & Co-Founder",
      bio: "Former blockchain engineer at leading DeFi protocols with 8+ years in cryptocurrency development.",
      image_url: null,
      linkedin_url: null,
      twitter_url: null,
      order_index: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "CTO & Co-Founder",
      bio: "Expert in distributed systems and cryptography, previously led engineering at major fintech companies.",
      image_url: null,
      linkedin_url: null,
      twitter_url: null,
      order_index: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      position: "Head of Product",
      bio: "Product strategist with deep understanding of user experience in blockchain applications.",
      image_url: null,
      linkedin_url: null,
      twitter_url: null,
      order_index: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  return (
    <div 
      className="min-h-screen bg-gray-950"
      style={{ 
        fontFamily: branding.font_family,
        background: `linear-gradient(135deg, ${primaryColor}40, ${secondaryColor}60, ${accentColor}40), linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)`
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {branding.logo_url ? (
              <img src={branding.logo_url} alt={branding.coin_name} className="w-8 h-8" />
            ) : (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                {branding.coin_symbol.charAt(0)}
              </div>
            )}
            <span className="text-xl font-bold text-white">{branding.coin_name}</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="text-white hover:text-opacity-80 transition-colors">About</a>
            <a href="#features" className="text-white hover:text-opacity-80 transition-colors">Features</a>
            <a href="#tokenomics" className="text-white hover:text-opacity-80 transition-colors">Tokenomics</a>
            <a href="#roadmap" className="text-white hover:text-opacity-80 transition-colors">Roadmap</a>
            <a href="#team" className="text-white hover:text-opacity-80 transition-colors">Team</a>
            <a href="#buy" className="text-white hover:text-opacity-80 transition-colors">Buy</a>
          </div>
          <Button 
            style={{ backgroundColor: accentColor }}
            className="text-white hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            {branding.coin_name}
            <span style={{ color: accentColor }}>.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            The future of decentralized finance is here. Experience ultra-fast transactions, 
            minimal fees, and maximum security with the next-generation blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              style={{ backgroundColor: primaryColor }}
              className="text-white hover:opacity-90 transition-opacity px-8 py-4 text-lg"
            >
              Buy {branding.coin_symbol} Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-300 transition-colors px-8 py-4 text-lg"
            >
              Read Whitepaper
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">{aboutContent.title}</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              {aboutContent.content}
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 px-4 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-900/80 border-gray-700/50 hover:bg-gray-800/90 transition-colors backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">Tokenomics</h2>
          {tokenomicsContent && (
            <div className="max-w-4xl mx-auto mb-8 text-center">
              <p className="text-lg text-white/80 leading-relaxed">
                {tokenomicsContent.content}
              </p>
            </div>
          )}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Token Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tokenomicsData.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-white/80">{item.label}</span>
                      <span className="text-white font-semibold">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tokenomicsData.slice(4).map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-white/80">{item.label}</span>
                      <span className="text-white font-semibold">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 px-4 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">Roadmap</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {displayRoadmapItems.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-4 h-4 rounded-full ${
                        item.status === 'completed' 
                          ? 'bg-green-500' 
                          : item.status === 'in_progress' 
                            ? `bg-[${accentColor}]`
                            : 'bg-gray-400'
                      }`}
                    />
                    {index < displayRoadmapItems.length - 1 && (
                      <div className="w-px h-16 bg-gray-600/60 mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.status === 'completed' 
                            ? 'border-green-500 text-green-400' 
                            : item.status === 'in_progress' 
                              ? 'border-amber-500 text-amber-400'
                              : 'border-gray-400 text-gray-400'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm">{item.quarter} {item.year}</p>
                    <p className="text-white/80 text-sm mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayTeamMembers.map((member) => (
              <Card key={member.id} className="bg-gray-900/80 border-gray-700/50 hover:bg-gray-800/90 transition-colors backdrop-blur-sm">
                <CardHeader className="text-center">
                  {member.image_url ? (
                    <img 
                      src={member.image_url} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-800/80 rounded-full mx-auto mb-4 flex items-center justify-center border border-gray-700/50">
                      <span className="text-2xl text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <CardTitle className="text-white text-xl">{member.name}</CardTitle>
                  <p style={{ color: accentColor }} className="font-semibold">{member.position}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm text-center">{member.bio}</p>
                  <div className="flex justify-center space-x-3 mt-4">
                    {member.linkedin_url && (
                      <a 
                        href={member.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.twitter_url && (
                      <a 
                        href={member.twitter_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section id="buy" className="py-20 px-4 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">How to Buy {branding.coin_symbol}</h2>
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="exchange" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900/80 border border-gray-700/50">
                <TabsTrigger value="exchange" className="text-white data-[state=active]:bg-gray-800/90 data-[state=active]:border-gray-600">Exchanges</TabsTrigger>
                <TabsTrigger value="wallet" className="text-white data-[state=active]:bg-gray-800/90 data-[state=active]:border-gray-600">Wallet</TabsTrigger>
                <TabsTrigger value="defi" className="text-white data-[state=active]:bg-gray-800/90 data-[state=active]:border-gray-600">DeFi</TabsTrigger>
              </TabsList>
              <TabsContent value="exchange" className="space-y-6 mt-8">
                <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Centralized Exchanges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">Buy {branding.coin_symbol} directly on major exchanges:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Binance', 'Coinbase', 'Kraken', 'KuCoin'].map((exchange) => (
                        <Button 
                          key={exchange}
                          variant="outline" 
                          className="text-white border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                        >
                          {exchange}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="wallet" className="space-y-6 mt-8">
                <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Supported Wallets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">Store and manage your {branding.coin_symbol} securely:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['MetaMask', 'Trust Wallet', 'Phantom', 'Ledger', 'Trezor', 'WalletConnect'].map((wallet) => (
                        <Button 
                          key={wallet}
                          variant="outline" 
                          className="text-white border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                        >
                          {wallet}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="defi" className="space-y-6 mt-8">
                <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">DeFi Platforms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">Trade and earn with {branding.coin_symbol} on DeFi:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Uniswap', 'PancakeSwap', 'SushiSwap', 'Curve'].map((platform) => (
                        <Button 
                          key={platform}
                          variant="outline" 
                          className="text-white border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                        >
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-700/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {branding.logo_url ? (
                <img src={branding.logo_url} alt={branding.coin_name} className="w-6 h-6" />
              ) : (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {branding.coin_symbol.charAt(0)}
                </div>
              )}
              <span className="text-white font-semibold">{branding.coin_name}</span>
            </div>
            <div className="flex space-x-6 text-white/60 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-white/60 text-sm mt-4 md:mt-0">
              © 2024 {branding.coin_name}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
