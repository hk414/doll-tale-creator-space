import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Sparkles, 
  Mail, 
  Users, 
  Calendar, 
  Gift, 
  Target,
  Send,
  Eye,
  TrendingUp,
  Heart,
  Share2,
  MessageSquare,
  Star
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'push' | 'social' | 'reward';
  status: 'draft' | 'active' | 'completed' | 'scheduled';
  audience: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  createdDate: string;
  scheduledDate?: string;
}

export const BrandMarketing = () => {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Holiday Collection Launch',
      type: 'email',
      status: 'active',
      audience: 'Premium Customers',
      sent: 342,
      opened: 289,
      clicked: 156,
      converted: 42,
      createdDate: '2025-06-20',
      scheduledDate: '2025-06-25'
    },
    {
      id: '2',
      name: 'Loyalty Reward Program',
      type: 'reward',
      status: 'completed',
      audience: 'All Customers',
      sent: 521,
      opened: 487,
      clicked: 312,
      converted: 89,
      createdDate: '2025-06-15'
    },
    {
      id: '3',
      name: 'New Doll Announcement',
      type: 'push',
      status: 'scheduled',
      audience: 'High Engagement',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      createdDate: '2025-06-24',
      scheduledDate: '2025-06-28'
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email' as const,
    audience: 'all',
    subject: '',
    content: '',
    scheduledDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail size={16} />;
      case 'push': return <Send size={16} />;
      case 'social': return <Share2 size={16} />;
      case 'reward': return <Gift size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/brand/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="p-2 bg-doll-gradient rounded-lg">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketing Hub</h1>
                <p className="text-gray-600">Create and manage marketing campaigns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Target className="text-doll-pink" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reach</p>
                  <p className="text-2xl font-bold text-gray-900">1,245</p>
                </div>
                <Users className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">73%</p>
                </div>
                <Heart className="text-red-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">12.3%</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Marketing Campaigns</h2>
              <Button className="bg-doll-gradient">
                <Sparkles size={16} className="mr-2" />
                New Campaign
              </Button>
            </div>

            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getTypeIcon(campaign.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">
                            {campaign.audience} • Created {new Date(campaign.createdDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold">{campaign.sent.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{campaign.opened.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Opened</p>
                        <p className="text-xs text-green-600">
                          {campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{campaign.clicked.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Clicked</p>
                        <p className="text-xs text-blue-600">
                          {campaign.opened > 0 ? Math.round((campaign.clicked / campaign.opened) * 100) : 0}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{campaign.converted.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Converted</p>
                        <p className="text-xs text-purple-600">
                          {campaign.clicked > 0 ? Math.round((campaign.converted / campaign.clicked) * 100) : 0}%
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      {campaign.scheduledDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          Scheduled for {new Date(campaign.scheduledDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex gap-2 ml-auto">
                        <Button size="sm" variant="outline">
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <TrendingUp size={14} className="mr-1" />
                          Analytics
                        </Button>
                        {campaign.status === 'draft' && (
                          <Button size="sm" className="bg-doll-gradient">
                            <Send size={14} className="mr-1" />
                            Send
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Name</label>
                    <Input
                      placeholder="Enter campaign name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Type</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value as any})}
                    >
                      <option value="email">Email Campaign</option>
                      <option value="push">Push Notification</option>
                      <option value="social">Social Media</option>
                      <option value="reward">Reward Campaign</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Audience</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={newCampaign.audience}
                      onChange={(e) => setNewCampaign({...newCampaign, audience: e.target.value})}
                    >
                      <option value="all">All Customers</option>
                      <option value="premium">Premium Customers</option>
                      <option value="high-engagement">High Engagement</option>
                      <option value="new">New Customers</option>
                      <option value="inactive">Inactive Customers</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Schedule Date (Optional)</label>
                    <Input
                      type="datetime-local"
                      value={newCampaign.scheduledDate}
                      onChange={(e) => setNewCampaign({...newCampaign, scheduledDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input
                    placeholder="Enter email subject or notification title"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Content</label>
                  <Textarea
                    placeholder="Write your campaign message..."
                    rows={6}
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button className="bg-doll-gradient">
                    <Send size={16} className="mr-2" />
                    {newCampaign.scheduledDate ? 'Schedule Campaign' : 'Send Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Template Cards */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Gift className="text-pink-600" size={20} />
                    </div>
                    <h3 className="font-semibold">Welcome Series</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Onboard new customers with a series of engaging emails introducing your brand and dolls.
                  </p>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500 fill-current" size={14} />
                    <span className="text-sm">Popular template</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">Use Template</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="text-blue-600" size={20} />
                    </div>
                    <h3 className="font-semibold">Holiday Promotion</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Create seasonal campaigns with special offers and limited-time collections.
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-green-500" size={14} />
                    <span className="text-sm">High conversion</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">Use Template</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Heart className="text-green-600" size={20} />
                    </div>
                    <h3 className="font-semibold">Loyalty Rewards</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Reward loyal customers with exclusive offers and early access to new collections.
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="text-purple-500" size={14} />
                    <span className="text-sm">Customer favorite</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">Use Template</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
