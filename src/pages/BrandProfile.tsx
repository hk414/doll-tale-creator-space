import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  Heart, 
  Star,
  Award,
  Sparkles,
  MessageCircle,
  Gift,
  Crown,
  TrendingUp,
  Calendar,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface BrandProfile {
  name: string;
  logo: string;
  description: string;
  website: string;
  founded: string;
  headquarters: string;
  specialty: string;
  customerBase: number;
  dollsLaunched: number;
  rating: number;
  verified: boolean;
}

interface Partnership {
  id: string;
  name: string;
  type: 'licensing' | 'collaboration' | 'retail' | 'marketing';
  status: 'active' | 'pending' | 'completed';
  startDate: string;
  value: number;
  description: string;
}

export const BrandProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState<BrandProfile>({
    name: "PopMart Studio",
    logo: "🎨",
    description: "Leading designer toy brand creating collectible characters that bring joy and imagination to collectors worldwide. We specialize in blind box figures, art toys, and immersive brand experiences.",
    website: "https://popmart.com",
    founded: "2010",
    headquarters: "Beijing, China",
    specialty: "Designer Toys & Collectibles",
    customerBase: 12450,
    dollsLaunched: 45,
    rating: 4.9,
    verified: true
  });

  const [partnerships] = useState<Partnership[]>([
    {
      id: '1',
      name: 'Global Retail Expansion',
      type: 'retail',
      status: 'active',
      startDate: '2024-03-01',
      value: 2500000,
      description: 'Partnership with major retail chains for global distribution'
    },
    {
      id: '2',
      name: 'Artist Collaboration Series',
      type: 'collaboration',
      status: 'pending',
      startDate: '2024-07-01',
      value: 500000,
      description: 'Limited edition series with renowned digital artists'
    },
    {
      id: '3',
      name: 'License Agreement - Entertainment',
      type: 'licensing',
      status: 'completed',
      startDate: '2024-01-01',
      value: 1200000,
      description: 'Character licensing for popular entertainment franchises'
    }
  ]);

  const achievements = [
    { title: "Verified Brand Partner", icon: <CheckCircle className="text-green-500" size={20} />, date: "2024-01-15" },
    { title: "Top Rated Brand", icon: <Star className="text-yellow-500" size={20} />, date: "2024-03-20" },
    { title: "Innovation Award", icon: <Award className="text-purple-500" size={20} />, date: "2024-05-10" },
    { title: "Customer Choice Award", icon: <Heart className="text-red-500" size={20} />, date: "2024-06-01" }
  ];

  const getPartnershipTypeColor = (type: string) => {
    switch (type) {
      case 'licensing': return 'bg-blue-100 text-blue-800';
      case 'collaboration': return 'bg-purple-100 text-purple-800';
      case 'retail': return 'bg-green-100 text-green-800';
      case 'marketing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-doll-gradient rounded-lg">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Brand Profile</h1>
                <p className="text-gray-600">Manage your brand presence and partnerships</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/brand/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button 
                className="bg-doll-gradient"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-4xl">{profile.logo}</span>
                    <div>
                      <h2 className="text-xl">{profile.name}</h2>
                      {profile.verified && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="text-blue-500" size={16} />
                          <span className="text-sm text-blue-600">Verified Brand</span>
                        </div>
                      )}
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500 fill-current" size={20} />
                    <span className="font-semibold">{profile.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Brand Name</label>
                      <Input 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        value={profile.description}
                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Website</label>
                        <Input 
                          value={profile.website}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Specialty</label>
                        <Input 
                          value={profile.specialty}
                          onChange={(e) => setProfile({...profile, specialty: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">{profile.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Website:</span>
                        <p className="font-medium">{profile.website}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Founded:</span>
                        <p className="font-medium">{profile.founded}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Headquarters:</span>
                        <p className="font-medium">{profile.headquarters}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Specialty:</span>
                        <p className="font-medium">{profile.specialty}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Customer Base</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.customerBase.toLocaleString()}</p>
                    </div>
                    <Users className="text-blue-500" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Dolls Launched</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.dollsLaunched}</p>
                    </div>
                    <Sparkles className="text-purple-500" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Brand Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.rating}/5</p>
                    </div>
                    <Star className="text-yellow-500" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Partnerships */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 size={20} />
                  Brand Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partnerships.map((partnership) => (
                    <div key={partnership.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{partnership.name}</h3>
                        <div className="flex gap-2">
                          <Badge className={getPartnershipTypeColor(partnership.type)}>
                            {partnership.type.charAt(0).toUpperCase() + partnership.type.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(partnership.status)}>
                            {partnership.status.charAt(0).toUpperCase() + partnership.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{partnership.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            Start: {new Date(partnership.startDate).toLocaleDateString()}
                          </span>
                          <span className="font-semibold text-green-600">
                            ${partnership.value.toLocaleString()}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Achievements & Quick Actions */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award size={20} />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {achievement.icon}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-600">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/brand/marketing" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Sparkles size={16} className="mr-2" />
                    Create Campaign
                  </Button>
                </Link>
                
                <Link to="/upload" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <ShoppingCart size={16} className="mr-2" />
                    Add New Doll
                  </Button>
                </Link>
                
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle size={16} className="mr-2" />
                  Customer Support
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Gift size={16} className="mr-2" />
                  Loyalty Program
                </Button>
                
                <Link to="/brand/analytics" className="block">
                  <Button className="w-full justify-start bg-doll-gradient text-white">
                    <TrendingUp size={16} className="mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Brand Tier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown size={20} />
                  Brand Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white">
                    <Crown size={24} className="mx-auto mb-2" />
                    <p className="font-semibold">Premium Brand</p>
                    <p className="text-sm opacity-90">Elite Partnership Status</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Custom Analytics</span>
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                    <div className="flex justify-between">
                      <span>Priority Support</span>
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                    <div className="flex justify-between">
                      <span>Featured Placement</span>
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                    <div className="flex justify-between">
                      <span>Advanced Tools</span>
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
