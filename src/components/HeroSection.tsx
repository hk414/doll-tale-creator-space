
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-doll-pink animate-float">
        <Star size={24} className="animate-sparkle" />
      </div>
      <div className="absolute top-32 right-20 text-doll-lavender animate-float" style={{animationDelay: '1s'}}>
        <Star size={18} className="animate-sparkle" />
      </div>
      <div className="absolute bottom-32 left-20 text-doll-coral animate-float" style={{animationDelay: '2s'}}>
        <Star size={20} className="animate-sparkle" />
      </div>
      
      <div className="max-w-6xl mx-auto text-center z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Bring Your Doll</span>
            <br />
            <span className="text-gray-800">to Life</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your beloved companion into a magical 3D experience. 
            Share their story, add sparkles, and create memories that last forever.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <Button 
            size="lg" 
            onClick={() => navigate('/upload')}
            className="bg-doll-gradient hover:scale-105 transition-all duration-300 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg"
          >
            <Plus className="mr-2" size={20} />
            Upload Your Doll
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/gallery')}
            className="border-2 border-doll-pink text-doll-pink hover:bg-doll-pink hover:text-white transition-all duration-300 px-8 py-4 text-lg rounded-full"
          >
            Explore Gallery
          </Button>
        </div>
        
        {/* Social proof */}
        <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
          <p className="text-gray-500 mb-4">Trusted by doll lovers worldwide</p>
          <div className="flex justify-center items-center gap-2 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-current" />
            ))}
            <span className="text-gray-600 ml-2">4.9/5 from 2,847 doll parents</span>
          </div>
        </div>
      </div>
    </section>
  );
};
