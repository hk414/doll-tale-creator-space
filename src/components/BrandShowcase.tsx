import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Star, 
  Users, 
  Crown, 
  TrendingUp, 
  Heart,
  ArrowRight,
  Sparkles,
  Gift,
  Award
} from "lucide-react";
import { apiClient } from "@/lib/api";

export const BrandShowcase = () => {
  const [featuredBrands, setFeaturedBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedBrands = async () => {
      try {
        const brands = await apiClient.getFeaturedBrands();
        setFeaturedBrands(brands);
      } catch (error) {
        console.error('Failed to load featured brands:', error);
        // Fallback to mock data
        setFeaturedBrands([
          {
            id: '1',
            name: "PopMart Studio",
            logo: "🎨",
            specialty: "Designer Toys",
            rating: 4.9,
            customers: "12.4K",
            verified: true,
            tier: "Premium",
            dolls: 45,
            description: "Leading creator of collectible art toys and designer figures"
          },
          {
            id: '2',
            name: "Sanrio Collection",
            logo: "🌸",
            specialty: "Character Goods",
            rating: 4.8,
            customers: "8.7K",
            verified: true,
            tier: "Premium",
            dolls: 32,
            description: "Beloved characters bringing joy and kawaii culture worldwide"
          },
          {
            id: '3',
            name: "Build-A-Bear Workshop",
            logo: "🧸",
            specialty: "Customizable Bears",
            rating: 4.7,
            customers: "15.2K",
            verified: true,
            tier: "Premium",
            dolls: 28,
            description: "Create your own personalized furry friend with endless possibilities"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedBrands();
  }, []);

  const brandStats = {
    totalBrands: 127,
    activeCampaigns: 45,
    customerEngagement: 89,
    brandSatisfaction: 4.8
  };

  return (
    <section className="py-20 px-4 bg-white/10 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-3 shadow-lg">
              <Building2 className="text-white" size={28} />
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">Brand Partners</h2>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Discover amazing brands creating magical experiences through their doll collections.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg border border-white/30">
            <div className="text-4xl font-extrabold text-white drop-shadow">{brandStats.totalBrands}</div>
            <div className="text-white/90 text-base font-semibold mt-2 flex items-center justify-center gap-2">
              <Building2 size={18} className="text-white" />
              Brand Partners
            </div>
          </div>
          <div className="text-center bg-gradient-to-br from-pink-500 to-yellow-400 rounded-xl p-6 shadow-lg border border-white/30">
            <div className="text-4xl font-extrabold text-white drop-shadow">{brandStats.activeCampaigns}</div>
            <div className="text-white/90 text-base font-semibold mt-2 flex items-center justify-center gap-2">
              <TrendingUp size={18} className="text-white" />
              Active Campaigns
            </div>
          </div>
          <div className="text-center bg-gradient-to-br from-blue-500 to-purple-400 rounded-xl p-6 shadow-lg border border-white/30">
            <div className="text-4xl font-extrabold text-white drop-shadow">{brandStats.customerEngagement}%</div>
            <div className="text-white/90 text-base font-semibold mt-2 flex items-center justify-center gap-2">
              <Users size={18} className="text-white" />
              Engagement Rate
            </div>
          </div>
          <div className="text-center bg-gradient-to-br from-green-500 to-teal-400 rounded-xl p-6 shadow-lg border border-white/30">
            <div className="text-4xl font-extrabold text-white drop-shadow">{brandStats.brandSatisfaction}/5</div>
            <div className="text-white/90 text-base font-semibold mt-2 flex items-center justify-center gap-2">
              <Star size={18} className="text-white" />
              Brand Satisfaction
            </div>
          </div>
        </div>

        {/* Featured Brands */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading featured brands...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredBrands.map((brand, index) => (
              <Card key={brand.id || index} className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{brand.logo}</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{brand.name}</h3>
                      {brand.verified && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <Crown size={12} className="mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mb-3">{brand.specialty}</Badge>
                  </div>

                  <p className="text-sm text-gray-600 text-center mb-4">
                    {brand.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-500 fill-current" size={14} />
                      <span>{brand.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-blue-500" size={14} />
                      <span>{brand.customers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-purple-500" size={14} />
                      <span>{brand.dolls} Dolls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="text-green-500" size={14} />
                      <span>{brand.tier}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/brand/profile`} className="flex-1">
                      <Button variant="outline" className="w-full text-sm">
                        View Profile
                      </Button>
                    </Link>
                    <Button className="flex-1 bg-doll-gradient text-sm">
                      <Heart size={14} className="mr-1" />
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Brand Partnership CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown size={32} />
            <h3 className="text-2xl font-bold">Partner With Us</h3>
          </div>
          <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
            Join our ecosystem of premium brands creating magical doll experiences. 
            Build stronger customer relationships and grow your community.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="p-3 bg-white/20 rounded-lg inline-block mb-2">
                <TrendingUp size={24} />
              </div>
              <h4 className="font-semibold mb-1">Analytics & Insights</h4>
              <p className="text-sm opacity-80">Deep customer behavior analytics</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-white/20 rounded-lg inline-block mb-2">
                <Gift size={24} />
              </div>
              <h4 className="font-semibold mb-1">Marketing Tools</h4>
              <p className="text-sm opacity-80">Powerful campaign management</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-white/20 rounded-lg inline-block mb-2">
                <Users size={24} />
              </div>
              <h4 className="font-semibold mb-1">Customer Engagement</h4>
              <p className="text-sm opacity-80">Direct relationship building</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/?brand=login">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 font-semibold">
                <Building2 size={16} className="mr-2" />
                Brand Login Portal
              </Button>
            </Link>
            <Button 
              
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 font-semibold"
            >
              Learn More
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
