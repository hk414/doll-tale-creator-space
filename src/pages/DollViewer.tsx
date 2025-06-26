
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DollViewerLayout } from "@/components/DollViewerLayout";
import { apiClient, type Doll } from "@/lib/api";

export default function DollViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doll, setDoll] = useState<Doll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoll = async () => {
      if (!id) {
        setError("No doll ID provided");
        setLoading(false);
        return;
      }

      try {
        const dollData = await apiClient.getDoll(id);
        setDoll(dollData);
      } catch (err) {
        console.error('Error loading doll:', err);
        setError(err instanceof Error ? err.message : 'Failed to load doll');
      } finally {
        setLoading(false);
      }
    };

    loadDoll();
  }, [id]);

  const updateDoll = (updatedDoll: Doll) => {
    setDoll(updatedDoll);
  };

  const addSticker = async (position: [number, number, number]) => {
    if (!doll || !id || doll.stickers.length >= 3) return;
    
    try {
      const newSticker = await apiClient.addSticker(id, 'heart', position);
      
      const updatedDoll = {
        ...doll,
        stickers: [...doll.stickers, newSticker]
      };
      
      updateDoll(updatedDoll);
      toast.success("Sticker added!");
    } catch (error) {
      console.error('Error adding sticker:', error);
      toast.error("Failed to add sticker");
    }
  };

  const removeSticker = async (stickerId: string) => {
    if (!doll || !id) return;
    
    try {
      await apiClient.removeSticker(id, stickerId);
      
      const updatedDoll = {
        ...doll,
        stickers: doll.stickers.filter(s => s.id !== stickerId)
      };
      
      updateDoll(updatedDoll);
      toast.success("Sticker removed!");
    } catch (error) {
      console.error('Error removing sticker:', error);
      toast.error("Failed to remove sticker");
    }
  };

  const handleVoiceRecorded = async (audioBlob: Blob, personalityTraits: string[]) => {
    if (!doll || !id) {
      throw new Error('Doll information not available');
    }
    
    try {
      console.log('DollViewer - handleVoiceRecorded called');
      console.log('DollViewer - Doll ID:', id);
      console.log('DollViewer - Audio blob size:', audioBlob.size);
      console.log('DollViewer - Personality traits:', personalityTraits);
      
      // Use the hardcoded API key from VoiceRecorder component
      const apiKey = "YOUR_ACTUAL_OPENAI_API_KEY_HERE"; // Replace with your actual API key starting with sk-proj- or sk- 
      
      console.log('DollViewer - Calling apiClient.saveVoiceProfile...');
      await apiClient.saveVoiceProfile(id, audioBlob, personalityTraits, apiKey);
      
      console.log('DollViewer - Voice profile saved successfully');
      
      const updatedDoll = {
        ...doll,
        voiceProfile: {
          personalityTraits,
          apiKey
        }
      };
      
      updateDoll(updatedDoll);
      console.log('DollViewer - Doll state updated');
      
    } catch (error) {
      console.error('DollViewer - Error in handleVoiceRecorded:', error);
      throw error; // Re-throw to let VoiceRecorder handle the error state
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-magic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doll-pink mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your doll...</p>
        </div>
      </div>
    );
  }

  if (error || !doll) {
    return (
      <div className="min-h-screen bg-magic-gradient flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Doll not found"}
          </h2>
          <Button onClick={() => navigate('/gallery')}>Back to Gallery</Button>
        </div>
      </div>
    );
  }

  return (
    <DollViewerLayout
      doll={doll}
      onBack={() => navigate('/gallery')}
      onStickerAdd={addSticker}
      onStickerRemove={removeSticker}
      onVoiceRecorded={handleVoiceRecorded}
    />
  );
}
