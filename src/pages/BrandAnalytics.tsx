import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Heart, 
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalCustomers: number;
  averageOrderValue: number;
  customerRetention: number;
  conversionRate: number;
  engagementRate: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

interface CustomerSegment {
  segment: string;
  customers: number;
  revenue: number;
  percentage: number;
  growth: number;
}

interface TopDoll {
  name: string;
  sales: number;
  revenue: number;
  rating: number;
  growth: number;
}

export const BrandAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  
  const [analytics] = useState<AnalyticsData>({
    totalRevenue: 126420,
    totalCustomers: 342,
    averageOrderValue: 54.50,
    customerRetention: 78,
    conversionRate: 12.3,
    engagementRate: 87
  });

  const [revenueData] = useState<RevenueData[]>([
    { month: 'Jan', revenue: 14700, orders: 42 },
    { month: 'Feb', revenue: 17850, orders: 51 },
    { month: 'Mar', revenue: 15980, orders: 47 },
    { month: 'Apr', revenue: 20670, orders: 63 },
    { month: 'May', revenue: 23320, orders: 71 },
    { month: 'Jun', revenue: 25200, orders: 78 }
  ]);

  const [customerSegments] = useState<CustomerSegment[]>([
    { segment: 'New Customers', customers: 89, revenue: 23400, percentage: 26, growth: 15 },
    { segment: 'Returning Customers', customers: 143, revenue: 67800, percentage: 42, growth: 8 },
    { segment: 'VIP Customers', customers: 67, revenue: 45200, percentage: 20, growth: 22 },
    { segment: 'Inactive Customers', customers: 43, revenue: 8900, percentage: 12, growth: -5 }
  ]);

  const [topDolls] = useState<TopDoll[]>([
    { name: 'Labubu Farmer', sales: 127, revenue: 4715, rating: 4.9, growth: 23 },
    { name: 'Labubu CNY', sales: 89, revenue: 3805, rating: 4.8, growth: 18 },
    { name: 'Build A Bear', sales: 203, revenue: 6550, rating: 4.7, growth: 12 },
    { name: 'Holiday Special', sales: 65, revenue: 2780, rating: 4.9, growth: 45 },
    { name: 'Summer Collection', sales: 156, revenue: 5665, rating: 4.6, growth: 8 }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP' 
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`;
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
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
                <p className="text-gray-600">Track performance and customer behavior</p>
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="p-2 border rounded-md text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                  <p className="text-xs text-green-600">+23% vs last period</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+15% vs last period</p>
                </div>
                <Users className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageOrderValue)}</p>
                  <p className="text-xs text-green-600">+8% vs last period</p>
                </div>
                <ShoppingCart className="text-purple-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Retention Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.customerRetention}%</p>
                  <p className="text-xs text-green-600">+5% vs last period</p>
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
                  <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                  <p className="text-xs text-green-600">+2.1% vs last period</p>
                </div>
                <Activity className="text-indigo-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.engagementRate}%</p>
                  <p className="text-xs text-green-600">+12% vs last period</p>
                </div>
                <Heart className="text-pink-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
            <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart size={20} />
                  Revenue & Orders Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">Revenue Chart Visualization</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Interactive chart showing revenue trends: {formatCurrency(revenueData.reduce((sum, item) => sum + item.revenue, 0))} total
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-6 gap-4 mt-6">
                  {revenueData.map((data, index) => (
                    <div key={index} className="text-center">
                      <p className="text-sm font-medium">{data.month}</p>
                      <p className="text-lg font-bold text-doll-pink">{formatCurrency(data.revenue)}</p>
                      <p className="text-xs text-gray-600">{data.orders} orders</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart size={20} />
                    Customer Segments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSegments.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{segment.segment}</h4>
                          <p className="text-sm text-gray-600">
                            {segment.customers} customers • {formatCurrency(segment.revenue)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{segment.percentage}%</p>
                          <p className={`text-xs ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(segment.growth)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Lifetime Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Average CLV</p>
                        <p className="text-2xl font-bold text-green-700">£262.50</p>
                      </div>
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">VIP Customer CLV</p>
                        <p className="text-2xl font-bold text-blue-700">£554.20</p>
                      </div>
                      <Users className="text-blue-600" size={24} />
                    </div>

                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Retention Rate</p>
                        <p className="text-2xl font-bold text-purple-700">78%</p>
                      </div>
                      <Heart className="text-purple-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Dolls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Doll Name</th>
                        <th className="text-left py-3 px-4">Sales</th>
                        <th className="text-left py-3 px-4">Revenue</th>
                        <th className="text-left py-3 px-4">Rating</th>
                        <th className="text-left py-3 px-4">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topDolls.map((doll, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{doll.name}</td>
                          <td className="py-3 px-4">{doll.sales}</td>
                          <td className="py-3 px-4">{formatCurrency(doll.revenue)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span>{doll.rating}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map((star) => (
                                  <span 
                                    key={star} 
                                    className={`text-xs ${star <= Math.floor(doll.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-sm ${doll.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPercentage(doll.growth)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Daily Active Chats</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Session Length</span>
                      <span className="font-semibold">8.4 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="font-semibold">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Videos Generated</span>
                      <span className="font-semibold">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg View Time</span>
                      <span className="font-semibold">45 sec</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Share Rate</span>
                      <span className="font-semibold">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Voice Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Voice Messages</span>
                      <span className="font-semibold">892</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TTS Usage</span>
                      <span className="font-semibold">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Satisfaction</span>
                      <span className="font-semibold">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
