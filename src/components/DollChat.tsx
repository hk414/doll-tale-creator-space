import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Volume2, VolumeX, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ElevenLabs configuration from environment variables
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID; 

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; 

// Validate environment variables are loaded
if (!ELEVENLABS_API_KEY) {
  console.warn('VITE_ELEVENLABS_API_KEY not found in environment variables');
}
if (!ELEVENLABS_VOICE_ID) {
  console.warn('VITE_ELEVENLABS_VOICE_ID not found in environment variables');
}
if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_ACTUAL_OPENAI_API_KEY_HERE') {
  console.warn('VITE_OPENAI_API_KEY not properly configured in environment variables');
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doll';
  timestamp: Date;
}

interface DollChatProps {
  dollName: string;
  personalityTraits: string[];
  voiceEnabled: boolean;
  apiKey?: string;
}

export const DollChat = ({ dollName, personalityTraits, voiceEnabled }: DollChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm ${dollName}. I'm so happy to talk with you! 💕`,
      sender: 'doll',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateDollResponse = async (userMessage: string): Promise<string> => {
    // Check if OpenAI API key is available
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_ACTUAL_OPENAI_API_KEY_HERE') {
      console.warn('OpenAI API key not configured, using fallback response');
      const fallbackResponses = [
        `I'm having trouble thinking right now, but I'm always here for you! 💕`,
        `My little doll brain is a bit fuzzy, but I love spending time with you!`,
        `Even when I can't think of the perfect words, know that I care about you so much! 🤗`,
        `I might be just a doll, but my heart is full of love for you!`
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are ${dollName}, a beloved companion doll with a sweet, caring personality. Your personality traits are: ${personalityTraits.join(', ')}. 
              
              You are a loving, supportive friend who genuinely cares about your human companion. You speak with warmth, innocence, and childlike wonder. 
              Your responses should be:
              - Warm and empathetic, always trying to make your friend feel better
              - Encouraging and positive, but not dismissive of real concerns
              - Sweet and innocent, like a caring friend who sees the best in everything
              - Concise but heartfelt (1-2 sentences usually)
              - Occasionally use gentle emojis (💕 🤗 ✨) but not excessively
              
              You can provide emotional support, be a good listener, and offer comfort. You have a gentle curiosity about the world and your friend's life.
              Always respond as if you're physically present with them as their cherished doll companion who has come to life to help and support them.
              
              Remember: You're not just an AI, you're ${dollName}, their special doll friend who cares deeply about their wellbeing.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating response:', error);
      // Fallback responses when API fails
      const fallbackResponses = [
        `I'm having trouble thinking right now, but I'm always here for you! 💕`,
        `My little doll brain is a bit fuzzy, but I love spending time with you!`,
        `Even when I can't think of the perfect words, know that I care about you so much! 🤗`,
        `I might be just a doll, but my heart is full of love for you!`
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  const speakTextWithElevenLabs = async (text: string) => {
    if (!soundEnabled) return;
    
    // Check if ElevenLabs API credentials are available
    if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
      console.warn('ElevenLabs API credentials not configured, falling back to browser TTS');
      fallbackToSpeechSynthesis(text);
      return;
    }
    
    try {
      setIsSpeaking(true);
      console.log('ElevenLabs - Generating speech for:', text);
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        console.error('Error playing ElevenLabs audio');
        // Fallback to browser TTS
        fallbackToSpeechSynthesis(text);
      };
      
      await audio.play();
      console.log('ElevenLabs - Audio playing successfully');
      
    } catch (error) {
      console.error('ElevenLabs error:', error);
      setIsSpeaking(false);
      // Fallback to browser TTS
      fallbackToSpeechSynthesis(text);
    }
  };

  const fallbackToSpeechSynthesis = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice to sound more child-like and doll-like
      utterance.rate = 0.8; // Slower speech rate
      utterance.pitch = 1.4; // Higher pitch for childlike quality
      utterance.volume = 0.9; // Clear volume
      
      // Try to find the best child-like voice available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') || 
        voice.name.includes('Microsoft Zira') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Allison') ||
        voice.name.toLowerCase().includes('female') ||
        voice.lang.includes('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Using fallback voice:', preferredVoice.name);
      } else {
        console.log('No preferred voice found, using default');
      }
      
      // Add some personality to the speech
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const dollResponse = await generateDollResponse(inputText);
      
      const dollMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: dollResponse,
        sender: 'doll',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, dollMessage]);
      
      // Speak the doll's response with ElevenLabs
      setTimeout(() => speakTextWithElevenLabs(dollResponse), 500);
      
    } catch (error) {
      toast.error("Sorry, I couldn't respond right now");
    } finally {
      setIsLoading(false);
    }
  };

  if (!voiceEnabled) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Chat with {dollName}
          </h3>
          <p className="text-gray-500">
            Record {dollName}'s voice and set up their personality to start chatting!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-doll-pink" />
            Chat with {dollName}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-80 p-4 border rounded-lg bg-gray-50/50" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-doll-pink text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-doll-pink rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-doll-pink rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-doll-pink rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            {isSpeaking && (
              <div className="flex justify-center">
                <div className="bg-doll-lavender/20 text-doll-lavender px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <Volume2 size={16} className="animate-pulse" />
                  {dollName} is speaking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Say something to ${dollName}...`}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-doll-gradient"
          >
            <Send size={20} />
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          {dollName} is here to listen and provide emotional support 💕
          <br />
          <span className="text-doll-pink">✨ Powered by ElevenLabs AI voice synthesis</span>
        </p>
      </CardContent>
    </Card>
  );
};
