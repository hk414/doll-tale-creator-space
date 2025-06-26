
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, Gamepad2, Calendar, Video } from "lucide-react";
import { toast } from "sonner";

interface Doll {
  id: string;
  name: string;
  story: string;
  brand: string;
  purchaseLocation: string;
  email: string;
  modelUrl: string;
  stickers: Array<{ id: string; type: string; position: [number, number, number] }>;
  voiceProfile?: {
    audioBlob: Blob;
    personalityTraits: string[];
    apiKey?: string;
  };
  dailyActivities?: string[];
  mood?: string;
  lastInteraction?: Date;
}

interface DollDetailsProps {
  doll: Doll;
}

export const DollDetails = ({ doll }: DollDetailsProps) => {
  const handlePlayGame = () => {
    toast.success(`${doll.name} wants to play hide and seek!`);
  };

  const handleTellStory = () => {
    const stories = [
      `${doll.name} went on an adventure to find magical flowers today!`,
      `${doll.name} helped a lost butterfly find its way home.`,
      `${doll.name} discovered a secret garden behind the toy chest.`,
      `${doll.name} made friends with a talking teddy bear today.`
    ];
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    toast.success(randomStory);
  };

  const generateDailyVideo = async () => {
    toast.success("Generating daily video...");
    // Simulate video generation
    setTimeout(() => {
      toast.success(`${doll.name}'s daily video is ready! 🎬`);
    }, 3000);
  };

  const getCurrentMood = () => {
    const moods = ["Happy", "Playful", "Curious", "Sleepy", "Excited"];
    return doll.mood || moods[Math.floor(Math.random() * moods.length)];
  };

  const getTodaysActivities = () => {
    return doll.dailyActivities || [
      "Played with toy blocks",
      "Had a tea party",
      "Told stories",
      "Danced to music"
    ];
  };

  return (
    <div className="space-y-4">
      {/* Basic Details */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-doll-pink" />
            About {doll.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {doll.brand && (
            <div>
              <Badge variant="secondary" className="bg-doll-pink/10 text-doll-pink">
                {doll.brand}
              </Badge>
            </div>
          )}
          
          {doll.story && (
            <div>
              <h4 className="font-semibold mb-2">Their Story</h4>
              <p className="text-gray-600 leading-relaxed">"{doll.story}"</p>
            </div>
          )}
          
          {doll.purchaseLocation && (
            <div>
              <h4 className="font-semibold mb-2">Origin</h4>
              <p className="text-gray-600">Found at: {doll.purchaseLocation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-doll-coral" />
            {doll.name}'s Day
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Mood:</span>
            <Badge className="bg-doll-gradient">{getCurrentMood()}</Badge>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Today's Activities</h4>
            <ul className="space-y-1">
              {getTodaysActivities().map((activity, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-doll-pink rounded-full"></div>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Features */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="text-doll-lavender" />
            Interactive Play
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handlePlayGame}
              variant="outline"
              className="text-doll-pink border-doll-pink hover:bg-doll-pink/10"
            >
              <Gamepad2 size={16} className="mr-2" />
              Play Game
            </Button>
            <Button 
              onClick={handleTellStory}
              variant="outline"
              className="text-doll-lavender border-doll-lavender hover:bg-doll-lavender/10"
            >
              <Calendar size={16} className="mr-2" />
              Tell Story
            </Button>
          </div>
          
          <Button 
            onClick={generateDailyVideo}
            className="w-full bg-doll-gradient"
          >
            <Video size={16} className="mr-2" />
            Generate Today's Video
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Daily videos showcase {doll.name}'s activities and growth 📹
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
