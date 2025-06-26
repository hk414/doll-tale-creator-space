
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Gift, MessageCircle, TrendingUp, Star, Building2, Crown } from "lucide-react";

interface BrandEngagementProps {
  brand: string;
  dollName: string;
}

export const BrandEngagement = ({ brand, dollName }: BrandEngagementProps) => {
  const brandInsights = {
    totalLoves: 1247,
    activeUsers: 89,
    storiesShared: 34,
    avgEngagement: 4.8
  };

  const brandFeatures = [
    {
      icon: MessageCircle,
      title: "Direct Messages",
      description: "Brands can send personalized messages to doll parents",
      action: "View Messages"
    },
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Special discounts and early access to new collections",
      action: "View Offers"
    },
    {
      icon: Users,
      title: "Community Events",
      description: "Join virtual meetups and brand-hosted activities",
      action: "Join Events"
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "See how your doll's story impacts the community",
      action: "View Analytics"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Brand Connection Status */}
      <Card className="bg-white/90 backdrop-blur-sm border-doll-pink/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-doll-pink" />
            Connected with {brand}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified Brand Partner
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-500 fill-current" size={16} />
              <span className="text-sm font-medium">{brandInsights.avgEngagement}/5</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-doll-pink/10 rounded-lg">
              <div className="text-2xl font-bold text-doll-pink">{brandInsights.totalLoves}</div>
              <div className="text-sm text-gray-600">Total Loves</div>
            </div>
            <div className="p-3 bg-doll-lavender/10 rounded-lg">
              <div className="text-2xl font-bold text-doll-lavender">{brandInsights.activeUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            {dollName} is helping {brand} build stronger relationships with {brandInsights.activeUsers} doll parents like you!
          </p>
        </CardContent>
      </Card>

      {/* Brand Features */}
      <div className="grid gap-4">
        {brandFeatures.map((feature, index) => (
          <Card key={index} className="bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-doll-gradient/20 rounded-lg">
                  <feature.icon className="text-doll-pink" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
                <Button variant="outline" size="sm" className="text-doll-pink border-doll-pink">
                  {feature.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Brand Loyalty Program */}
      <Card className="bg-doll-gradient/10 border-doll-pink/30">
        <CardHeader>
          <CardTitle className="text-center">
            🎉 {brand} Loyalty Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Badge className="bg-doll-pink">Level 2 Collector</Badge>
            <Badge variant="outline">Next: Level 3 (2 more dolls)</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Upload more {brand} dolls to unlock exclusive rewards and early access to new collections!
          </p>
          <Button className="bg-doll-gradient">
            View Rewards Program
          </Button>
        </CardContent>
      </Card>

    </div>
  );
};
