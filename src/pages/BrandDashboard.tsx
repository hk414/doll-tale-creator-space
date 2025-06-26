import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Store, 
  Users, 
  Heart, 
  TrendingUp, 
  Package, 
  MessageCircle, 
  Star,
  Calendar,
  Gift,
  Sparkles,
  Crown,
  Award,
  Eye,
  X
} from "lucide-react";

interface BrandStats {
  totalDolls: number;
  totalCustomers: number;
  engagement: number;
  satisfaction: number;
  revenue: number;
  growth: number;
}

interface BrandDoll {
  id: string;
  name: string;
  model_path: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  featured: boolean;
  category: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  dollsOwned: number;
  engagement: number;
  lastActive: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  dolls: Array<{
    id: string;
    name: string;
    story: string;
    brand: string;
    purchaseDate: string;
    modelUrl: string;
  }>;
}

export const BrandDashboard = () => {
  const { brandId } = useParams();
  const [stats, setStats] = useState<BrandStats>({
    totalDolls: 0,
    totalCustomers: 0,
    engagement: 0,
    satisfaction: 0,
    revenue: 0,
    growth: 0
  });
  const [dolls, setDolls] = useState<BrandDoll[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    setStats({
      totalDolls: 15,
      totalCustomers: 342,
      engagement: 87,
      satisfaction: 4.8,
      revenue: 124520, // In pounds
      growth: 23
    });

    setDolls([
      {
        id: '1',
        name: 'Labubu Farmer',
        model_path: '/api/uploads/a08c3384-4b30-4883-a584-e89074f51f7c-labubu_-_farmer.glb',
        description: 'Adorable farming companion with overalls and hat',
        price: 37.99, // In pounds
        rating: 4.9,
        reviews: 127,
        featured: true,
        category: 'Adventure'
      },
      {
        id: '2',
        name: 'Labubu CNY',
        model_path: '/api/uploads/f1b38f66-e1a6-4f98-83a6-e012c972c54e-labubu_cny.glb',
        description: 'Festive Chinese New Year celebration doll',
        price: 42.99, // In pounds
        rating: 4.8,
        reviews: 89,
        featured: true,
        category: 'Holiday'
      },
      {
        id: '3',
        name: 'Build A Bear',
        model_path: '/api/uploads/c760f85a-74c5-492e-9719-9cb0f2acfc88-build_a_bear.glb',
        description: 'Customizable teddy bear with endless possibilities',
        price: 32.99, // In pounds
        rating: 4.7,
        reviews: 203,
        featured: false,
        category: 'Classic'
      }
    ]);

    setCustomers([
      {
        id: '1',
        name: 'Emma Chen',
        email: 'emma.chen@email.com',
        joinDate: '2024-03-15',
        dollsOwned: 3,
        engagement: 95,
        lastActive: '2025-06-24',
        tier: 'Gold',
        totalSpent: 215.75,
        dolls: [
          {
            id: 'doll1',
            name: 'Luna the Labubu',
            story: 'Luna loves exploring magical gardens and collecting shiny stones. She dreams of becoming a fairy gardener and talks to flowers every morning.',
            brand: 'Labubu',
            purchaseDate: '2024-03-20',
            modelUrl: '/api/uploads/a08c3384-4b30-4883-a584-e89074f51f7c-labubu_-_farmer.glb'
          },
          {
            id: 'doll2',
            name: 'Blossom CNY',
            story: 'Blossom brings good luck and prosperity wherever she goes. She loves celebrating festivals and sharing dumplings with friends.',
            brand: 'Labubu',
            purchaseDate: '2024-12-15',
            modelUrl: '/api/uploads/f1b38f66-e1a6-4f98-83a6-e012c972c54e-labubu_cny.glb'
          }
        ]
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        joinDate: '2024-05-20',
        dollsOwned: 5,
        engagement: 88,
        lastActive: '2025-06-25',
        tier: 'Platinum',
        totalSpent: 358.20,
        dolls: [
          {
            id: 'doll3',
            name: 'Sparkle the Explorer',
            story: 'Sparkle is always ready for an adventure! She carries a tiny backpack filled with treasures and loves discovering new places around the house.',
            brand: 'Labubu',
            purchaseDate: '2024-05-25',
            modelUrl: '/api/uploads/a08c3384-4b30-4883-a584-e89074f51f7c-labubu_-_farmer.glb'
          }
        ]
      },
      {
        id: '3',
        name: 'Maria Rodriguez',
        email: 'maria.r@email.com',
        joinDate: '2024-01-10',
        dollsOwned: 2,
        engagement: 72,
        lastActive: '2025-06-23',
        tier: 'Silver',
        totalSpent: 108.75,
        dolls: [
          {
            id: 'doll4',
            name: 'Sunny Bear',
            story: 'Sunny Bear loves warm hugs and sunny days. She enjoys picnics in the garden and always shares her honey with friends.',
            brand: 'Labubu',
            purchaseDate: '2024-01-15',
            modelUrl: '/api/uploads/c760f85a-74c5-492e-9719-9cb0f2acfc88-build_a_bear.glb'
          }
        ]
      }
    ]);

    setLoading(false);
  }, [brandId]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum': return <Crown className="text-purple-500" size={16} />;
      case 'Gold': return <Award className="text-yellow-500" size={16} />;
      case 'Silver': return <Star className="text-gray-400" size={16} />;
      default: return <Badge className="text-orange-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-doll-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading brand dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-doll-gradient rounded-lg">
                <Store className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Brand Dashboard</h1>
                <p className="text-gray-600">Manage your doll collection and customer relationships</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/brand/marketing">
                <Button variant="outline">
                  <Sparkles size={16} className="mr-2" />
                  Marketing Tools
                </Button>
              </Link>
              <Link to="/brand/analytics">
                <Button className="bg-doll-gradient">
                  <TrendingUp size={16} className="mr-2" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Dolls</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDolls}</p>
                </div>
                <Package className="text-doll-pink" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
                <Users className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.engagement}%</p>
                </div>
                <Heart className="text-red-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.satisfaction}/5</p>
                </div>
                <Star className="text-yellow-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">£{stats.revenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Growth</p>
                  <p className="text-2xl font-bold text-gray-900">+{stats.growth}%</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dolls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dolls">Doll Collection</TabsTrigger>
            <TabsTrigger value="customers">Customer Relationships</TabsTrigger>
            <TabsTrigger value="campaigns">Marketing Campaigns</TabsTrigger>
            <TabsTrigger value="insights">Customer Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dolls" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Doll Collection</h2>
              <Link to="/upload">
                <Button className="bg-doll-gradient">
                  <Package size={16} className="mr-2" />
                  Add New Doll
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dolls.map((doll) => (
                <Card key={doll.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg">{doll.name}</h3>
                      {doll.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{doll.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold">£{doll.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-500 fill-current" size={14} />
                          <span className="text-sm">{doll.rating} ({doll.reviews})</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Category:</span>
                        <Badge variant="outline">{doll.category}</Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/doll/${doll.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">View Details</Button>
                      </Link>
                      <Button className="bg-doll-gradient flex-1">
                        <MessageCircle size={16} className="mr-2" />
                        Customer Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Customer Relationships</h2>
              <Button className="bg-doll-gradient">
                <Gift size={16} className="mr-2" />
                Send Rewards
              </Button>
            </div>

            <div className="grid gap-4">
              {customers.map((customer) => (
                <Card key={customer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-doll-gradient rounded-full flex items-center justify-center text-white font-semibold">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {customer.name}
                            {getTierIcon(customer.tier)}
                            <Badge variant="outline">{customer.tier}</Badge>
                          </h3>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(customer.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-semibold">{customer.dollsOwned}</p>
                            <p className="text-xs text-gray-600">Dolls Owned</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold">{customer.engagement}%</p>
                            <p className="text-xs text-gray-600">Engagement</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold">£{customer.totalSpent}</p>
                            <p className="text-xs text-gray-600">Total Spent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm">{new Date(customer.lastActive).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-600">Last Active</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowCustomerDetails(true);
                            }}
                          >
                            <Eye size={14} className="mr-1" />
                            View Dolls
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle size={14} className="mr-1" />
                            Message
                          </Button>
                          <Button size="sm" className="bg-doll-gradient">
                            <Gift size={14} className="mr-1" />
                            Reward
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="text-center py-12">
              <Sparkles className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold mb-2">Marketing Campaigns</h3>
              <p className="text-gray-600 mb-6">Create targeted campaigns to engage your customers</p>
              <Link to="/brand/marketing">
                <Button className="bg-doll-gradient">
                  <Sparkles size={16} className="mr-2" />
                  Create Campaign
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="text-center py-12">
              <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold mb-2">Customer Insights</h3>
              <p className="text-gray-600 mb-6">Deep analytics and customer behavior insights</p>
              <Link to="/brand/analytics">
                <Button className="bg-doll-gradient">
                  <TrendingUp size={16} className="mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Customer Doll Details Modal */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="text-doll-pink" />
              {selectedCustomer?.name}'s Labubu Collection
              <Badge className={selectedCustomer?.tier === 'Platinum' ? 'bg-purple-100 text-purple-800' : 
                                selectedCustomer?.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                selectedCustomer?.tier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                                'bg-orange-100 text-orange-800'}>
                {selectedCustomer?.tier} Customer
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-doll-pink">{selectedCustomer.dollsOwned}</p>
                  <p className="text-sm text-gray-600">Total Dolls</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">£{selectedCustomer.totalSpent}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.engagement}%</p>
                  <p className="text-sm text-gray-600">Engagement</p>
                </div>
              </div>

              {/* Customer's Dolls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="text-doll-pink" />
                  Their Labubu Stories
                </h3>
                
                <div className="grid gap-6">
                  {selectedCustomer.dolls.map((doll) => (
                    <Card key={doll.id} className="border-doll-pink/20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-doll-gradient/20 rounded-lg flex items-center justify-center">
                            <Package className="text-doll-pink" size={24} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold text-gray-800">{doll.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {doll.brand}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Purchased {new Date(doll.purchaseDate).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="bg-gradient-to-r from-doll-pink/10 to-doll-lavender/10 p-4 rounded-lg">
                              <p className="text-gray-700 leading-relaxed">{doll.story}</p>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline">
                                <Heart size={14} className="mr-1" />
                                Send Love
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageCircle size={14} className="mr-1" />
                                Comment
                              </Button>
                              <Button size="sm" className="bg-doll-gradient">
                                <Gift size={14} className="mr-1" />
                                Send Gift
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {selectedCustomer.dolls.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="mx-auto mb-4" size={48} />
                    <p>No Labubu dolls uploaded yet</p>
                  </div>
                )}
              </div>

              {/* Engagement Actions */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Heart className="text-doll-pink" />
                  Customer Engagement Opportunities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Gift size={16} className="mr-2" />
                    Send Exclusive Offer
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Calendar size={16} className="mr-2" />
                    Invite to Event
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Star size={16} className="mr-2" />
                    Feature Their Story
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Sparkles size={16} className="mr-2" />
                    Early Access Preview
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
