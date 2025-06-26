
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Square, Play, Pause, MessageCircle, Settings } from "lucide-react";
import { toast } from "sonner";

// Your OpenAI API key - replace with your actual key
// Get your API key from: https://platform.openai.com/api-keys
const OPENAI_API_KEY = "YOUR_ACTUAL_OPENAI_API_KEY_HERE"; // Replace with your actual API key starting with sk-proj- or sk-

// ElevenLabs configuration
const ELEVENLABS_API_KEY = "sk_e8b8b8b7ff6df56eb726f8593ffdaf36d58a5ff63cb60be9";

interface VoiceRecorderProps {
  dollName: string;
  onVoiceRecorded: (audioBlob: Blob, personalityTraits: string[]) => void;
}

export const VoiceRecorder = ({ dollName, onVoiceRecorded }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([
    "Friendly", "Caring", "Playful"
  ]);
  const [customTrait, setCustomTrait] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started! Talk to your doll...");
    } catch (error) {
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording saved!");
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const addPersonalityTrait = () => {
    if (customTrait && !personalityTraits.includes(customTrait)) {
      setPersonalityTraits([...personalityTraits, customTrait]);
      setCustomTrait("");
    }
  };

  const removePersonalityTrait = (trait: string) => {
    setPersonalityTraits(personalityTraits.filter(t => t !== trait));
  };

  const saveVoiceProfile = async () => {
    if (!audioBlob || personalityTraits.length === 0) {
      toast.error("Please record audio and add personality traits");
      return;
    }

    setIsSaving(true);
    try {
      console.log('VoiceRecorder - Starting save process...');
      console.log('VoiceRecorder - Audio blob size:', audioBlob.size);
      console.log('VoiceRecorder - Personality traits:', personalityTraits);
      
      await onVoiceRecorded(audioBlob, personalityTraits);
      
      console.log('VoiceRecorder - Save successful!');
      toast.success(`${dollName}'s voice and personality saved! They're ready to chat! 💕`);
      
      // Clear the recording after successful save
      setAudioBlob(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      
    } catch (error) {
      console.error('VoiceRecorder - Error saving voice profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to save voice profile: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Recording */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="text-doll-pink" />
            Record {dollName}'s Voice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Record how {dollName} talks so they can have conversations with you! 
            <br />
            <span className="text-sm text-gray-500">
              💡 Tip: Speak in the voice you want {dollName} to have - sweet, gentle, and caring
            </span>
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-doll-gradient'} transition-all duration-300`}
              size="lg"
            >
              {isRecording ? (
                <>
                  <Square className="mr-2" size={20} />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2" size={20} />
                  Start Recording
                </>
              )}
            </Button>
            
            {audioBlob && (
              <Button
                onClick={isPlaying ? pauseRecording : playRecording}
                variant="outline"
                size="lg"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2" size={20} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2" size={20} />
                    Play
                  </>
                )}
              </Button>
            )}
          </div>
          
          {isRecording && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-red-500 animate-pulse">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Recording... Say something like "Hello! I'm {dollName} and I love spending time with you!"
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personality Traits */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="text-doll-lavender" />
            {dollName}'s Personality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Describe {dollName}'s personality to make conversations more authentic.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {personalityTraits.map((trait) => (
              <span
                key={trait}
                className="bg-doll-pink/20 text-doll-pink px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-doll-pink/30 transition-colors"
                onClick={() => removePersonalityTrait(trait)}
              >
                {trait} ×
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={customTrait}
              onChange={(e) => setCustomTrait(e.target.value)}
              placeholder="Add personality trait..."
              onKeyPress={(e) => e.key === 'Enter' && addPersonalityTrait()}
            />
            <Button onClick={addPersonalityTrait} variant="outline">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Setup */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="text-doll-coral" />
            Enable AI Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Save {dollName}'s voice and personality to enable intelligent conversations.
            {dollName} will respond with high-quality ElevenLabs text-to-speech that matches their recorded personality!
            <br />
            <span className="text-sm text-doll-pink font-medium">
              ✨ Using professional-grade voice synthesis for the most realistic doll voice experience
            </span>
          </p>
          
          <Button
            onClick={saveVoiceProfile}
            className="w-full bg-doll-gradient"
            disabled={!audioBlob || personalityTraits.length === 0 || isSaving}
          >
            {isSaving ? "Saving..." : 
             !audioBlob ? "Record Voice First" :
             personalityTraits.length === 0 ? "Add Personality Traits" :
             "Save Voice Profile & Enable Chat"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
