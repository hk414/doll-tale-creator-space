
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Share } from "lucide-react";
import { toast } from "sonner";
import { DollModel3D } from "./DollModel3D";
import { DollDetails } from "./DollDetails";
import { BrandEngagement } from "./BrandEngagement";
import { VoiceRecorder } from "./VoiceRecorder";
import { DollChat } from "./DollChat";
import { DollActivities } from "./DollActivities";
import { type Doll } from "@/lib/api";

interface DollViewerLayoutProps {
  doll: Doll;
  onBack: () => void;
  onStickerAdd: (position: [number, number, number]) => void;
  onStickerRemove: (stickerId: string) => void;
  onVoiceRecorded: (audioBlob: Blob, personalityTraits: string[]) => void;
}

export const DollViewerLayout = ({ 
  doll, 
  onBack, 
  onStickerAdd, 
  onStickerRemove, 
  onVoiceRecorded 
}: DollViewerLayoutProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Meet ${doll.name}!`,
        text: doll.story,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-magic-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Gallery
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{doll.name}</span>
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share className="mr-2" size={16} />
                  Share
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DollModel3D
                dollName={doll.name}
                modelUrl={doll.modelUrl}
                stickers={doll.stickers}
                onStickerAdd={onStickerAdd}
                onStickerRemove={onStickerRemove}
              />
            </CardContent>
          </Card>

          {/* Enhanced Features with Tabs */}
          <div className="space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="voice">Voice</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="brand">Brand</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <DollDetails doll={{
                  ...doll,
                  voiceProfile: doll.voiceProfile
                    ? { audioBlob: (doll.voiceProfile as any).audioBlob ?? null, ...doll.voiceProfile }
                    : undefined
                }} />
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                <DollActivities dollName={doll.name} dollId={doll.id} />
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <VoiceRecorder
                  dollName={doll.name}
                  onVoiceRecorded={onVoiceRecorded}
                />
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <DollChat
                  dollName={doll.name}
                  personalityTraits={doll.voiceProfile?.personalityTraits || []}
                  voiceEnabled={!!doll.voiceProfile}
                  apiKey={doll.voiceProfile?.apiKey}
                />
              </TabsContent>

              <TabsContent value="brand" className="space-y-4">
                {doll.brand ? (
                  <BrandEngagement brand={doll.brand} dollName={doll.name} />
                ) : (
                  <Card className="bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No brand information available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
