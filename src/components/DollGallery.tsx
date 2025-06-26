
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const DollGallery = () => {
  const dolls = [
    {
      name: "Coco Bear",
      story: "My daughter's best friend since she was 3. They go everywhere together!",
      brand: "Jellycat",
      loves: 247,
      image: "https://tse3.mm.bing.net/th?id=OIP.DnLZ2wkxfbC81CGBq5HoNgHaHa&pid=Api&P=0&h=220?w=400&h=400&fit=crop"
    },
    {
      name: "Blossom Bunny",
      story: "Found at a thrift store and restored with love. Now she's the queen of our home.",
      brand: "Jellycat",
      loves: 189,
      image: "https://tse3.mm.bing.net/th?id=OIP.7bYwtZH6M-TJQeNkvuDQgAHaHa&pid=Api&P=0&h=220?w=400&h=400&fit=crop"
    },
    {
      name: "Luna Lamb",
      story: "A gift from grandma that became my comfort during tough times. She's my guardian angel.",
      brand: "Labubu",
      loves: 356,
      image: "https://tse1.mm.bing.net/th?id=OIP.AYk6Tt957SUGuNaAF1YXWwHaHa&pid=Api&P=0&h=220?w=400&h=400&fit=crop"
    },
    {
      name: "Sparkle",
      story: "My therapy doll who helped me through anxiety. She's been my brave companion.",
      brand: "Build-A-Bear",
      loves: 412,
      image: "https://tse2.mm.bing.net/th?id=OIP.2BOppczlU6-KohKmq19CzgHaHa&pid=Api&P=0&h=220?w=400&h=400&fit=crop"
    }
  ];

  return (
    <section className="py-20 px-4 bg-doll-gradient/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Stories from Our
            <span className="text-gradient"> Doll Family</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every doll has a story. Every story deserves to be shared. 
            Discover the magical bonds between dolls and their humans.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dolls.map((doll, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={doll.image} 
                  alt={doll.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{doll.name}</h3>
                  <span className="text-sm text-doll-pink bg-doll-pink/10 px-2 py-1 rounded-full">
                    {doll.brand}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  "{doll.story}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-doll-coral">
                    <Star size={16} className="fill-current" />
                    <span className="text-sm font-medium">{doll.loves}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-doll-pink hover:text-doll-pink hover:bg-doll-pink/10">
                    View Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-doll-pink text-doll-pink hover:bg-doll-pink hover:text-white transition-all duration-300 px-8 py-4 text-lg rounded-full"
          >
            Explore All Stories
          </Button>
        </div>
      </div>
    </section>
  );
};
