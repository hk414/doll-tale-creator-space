
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-doll-gradient relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-white/30 animate-float">
        <Star size={24} className="animate-sparkle" />
      </div>
      <div className="absolute bottom-10 right-10 text-white/30 animate-float" style={{animationDelay: '1s'}}>
        <Star size={20} className="animate-sparkle" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Ready to Bring Your
          <br />
          Doll to Life?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of doll parents who've already discovered the magic. 
          Your doll's story is waiting to be told.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            onClick={() => navigate('/upload')}
            className="bg-white text-doll-pink hover:bg-white/90 hover:scale-105 transition-all duration-300 font-semibold px-8 py-4 text-lg rounded-full shadow-lg"
          >
            <Plus className="mr-2" size={20} />
            Start Your Journey
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/gallery')}
            className="bg-white text-doll-pink hover:bg-white/90 hover:scale-105 hover:text-doll-pink transition-all duration-300 font-semibold px-8 py-4 text-lg rounded-full shadow-lg"
          >
            Learn More
          </Button>
        </div>
        
        <div className="text-white/80 text-sm">
          <p>Free to start • No credit card required • Safe & secure</p>
        </div>
      </div>
    </section>
  );
};
