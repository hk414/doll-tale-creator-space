
import { Card, CardContent } from "@/components/ui/card";
import { Image, Plus, Star } from "lucide-react";

export const UploadFlow = () => {
  const steps = [
    {
      icon: <Image className="w-8 h-8 text-doll-pink" />,
      title: "Upload Your Doll",
      description: "Drag & drop your doll's photo or 3D model to get started"
    },
    {
      icon: <Plus className="w-8 h-8 text-doll-lavender" />,
      title: "Add Personality",
      description: "Give your doll a name and share their special story"
    },
    {
      icon: <Star className="w-8 h-8 text-doll-coral" />,
      title: "Customize & Share",
      description: "Add magical stickers and share with the world"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Three Simple Steps to
            <span className="text-gradient"> Magic</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creating your doll's digital twin has never been easier. 
            Follow these simple steps and watch the magic unfold.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-doll-pink/20">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-doll-gradient/10 group-hover:bg-doll-gradient/20 transition-colors duration-300">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                <div className="mt-6 text-doll-pink font-semibold">Step {index + 1}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
