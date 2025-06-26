
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const BrandBenefits = () => {
  const benefits = [
    {
      title: "Authentic Stories",
      description: "Real stories from real doll parents, creating genuine emotional connections",
      stat: "10,000+",
      statLabel: "Stories Shared"
    },
    {
      title: "Customer Love",
      description: "Building lasting relationships between brands and their most passionate fans",
      stat: "4.9/5",
      statLabel: "Love Rating"
    },
    {
      title: "Global Community",
      description: "Connecting doll lovers worldwide in a safe, magical digital space",
      stat: "50+",
      statLabel: "Countries"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Why Brands
            <span className="text-gradient"> Love Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We don't just showcase products - we celebrate the emotional bonds 
            that make your brand unforgettable.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-doll-pink/20">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gradient mb-2">{benefit.stat}</div>
                  <div className="text-sm text-doll-pink font-medium">{benefit.statLabel}</div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-doll-gradient/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              "MyDollSpace helped us understand our customers' emotional connection to our products like never before."
            </h3>
            <p className="text-gray-600 mb-4">- Sarah Chen, Brand Manager at Jellycat</p>
            <div className="flex justify-center items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
