import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Download, RefreshCw, Calendar, Clock, Heart } from "lucide-react";
import { toast } from "sonner";

// Creatomate API configuration
const CREATOMATE_API_KEY = "0792545e54324d71b4b89f73525f01202e1976bd8d361beebfaa2a2bb3597aa1c7763bab1cd14c99e4d12db7e969d9c2";
const CREATOMATE_TEMPLATE_ID = "f238bbb1-fa01-4cb5-835e-6582a337ff4d";

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  emoji: string;
  type: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

interface VideoRender {
  id: string;
  status: 'planned' | 'processing' | 'succeeded' | 'failed';
  url?: string;
  snapshot_url?: string;
  activityId: string;
}

interface DollActivitiesProps {
  dollName: string;
  dollId: string;
}

const activityTemplates: Activity[] = [
  { id: '1', title: 'Morning Stretch', description: '{dollName} starts the day with gentle stretches and a big yawn!', time: '8:00 AM', emoji: '🌅', type: 'morning' },
  { id: '2', title: 'Tea Time', description: '{dollName} enjoys a cozy cup of tea and some cookies', time: '10:30 AM', emoji: '☕', type: 'morning' },
  { id: '3', title: 'Garden Play', description: '{dollName} dances among the flowers and chases butterflies', time: '2:00 PM', emoji: '🌸', type: 'afternoon' },
  { id: '4', title: 'Reading Adventure', description: '{dollName} gets lost in a magical storybook', time: '3:30 PM', emoji: '📚', type: 'afternoon' },
  { id: '5', title: 'Art Creation', description: '{dollName} paints colorful masterpieces with tiny brushes', time: '4:00 PM', emoji: '🎨', type: 'afternoon' },
  { id: '6', title: 'Sunset Watch', description: '{dollName} watches the beautiful sunset from the window', time: '6:30 PM', emoji: '🌇', type: 'evening' },
  { id: '7', title: 'Bedtime Story', description: '{dollName} listens to gentle bedtime stories', time: '8:00 PM', emoji: '📖', type: 'evening' },
  { id: '8', title: 'Dream Preparation', description: '{dollName} gets ready for sweet dreams and adventures', time: '9:00 PM', emoji: '💤', type: 'evening' },
  { id: '9', title: 'Music Dance', description: '{dollName} dances to favorite melodies and hums along', time: 'Anytime', emoji: '🎵', type: 'anytime' },
  { id: '10', title: 'Friend Visit', description: '{dollName} has tea parties with other doll friends', time: 'Anytime', emoji: '🎀', type: 'anytime' },
  { id: '11', title: 'Bubble Play', description: '{dollName} chases magical soap bubbles around the room', time: 'Anytime', emoji: '🫧', type: 'anytime' },
  { id: '12', title: 'Snack Time', description: '{dollName} enjoys tiny treats and shares with stuffed friends', time: '11:00 AM', emoji: '🍪', type: 'morning' },
];

export const DollActivities = ({ dollName, dollId }: DollActivitiesProps) => {
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [videoRenders, setVideoRenders] = useState<VideoRender[]>([]);
  const [loadingVideo, setLoadingVideo] = useState<string | null>(null);
  const [videoCache, setVideoCache] = useState<Record<string, VideoRender>>({});

  // Generate random activities for today
  useEffect(() => {
    generateTodayActivities();
    
    // Pre-populate cache with known successful videos
    setVideoCache({
      'fafa-Sunset Watch': {
        id: '926fd1dc-195a-4541-8967-64cab0b5c802',
        status: 'succeeded',
        url: 'https://f002.backblazeb2.com/file/creatomate-c8xg3hsxdu/926fd1dc-195a-4541-8967-64cab0b5c802.mp4',
        activityId: '6' // Sunset Watch activity ID
      }
    });
  }, [dollName]);

  const generateTodayActivities = () => {
    // Select 3-5 random activities for today
    const numActivities = Math.floor(Math.random() * 3) + 3; // 3-5 activities
    const selectedActivities = [...activityTemplates]
      .sort(() => Math.random() - 0.5)
      .slice(0, numActivities)
      .map(activity => ({
        ...activity,
        description: activity.description.replace(/{dollName}/g, dollName)
      }))
      .sort((a, b) => {
        // Sort by time of day
        const timeOrder = { morning: 0, afternoon: 1, evening: 2, anytime: 3 };
        return timeOrder[a.type] - timeOrder[b.type];
      });

    setTodayActivities(selectedActivities);
  };

  const createVideo = async (activity: Activity) => {
    setLoadingVideo(activity.id);
    
    // Create a cache key based on doll name and activity title
    const cacheKey = `${dollName}-${activity.title}`;
    
    // Check if we already have a video for this activity
    if (videoCache[cacheKey]) {
      console.log(`Using cached video for ${activity.title}`);
      const cachedVideo = videoCache[cacheKey];
      setVideoRenders(prev => {
        const existing = prev.find(r => r.activityId === activity.id);
        if (!existing) {
          return [...prev, { ...cachedVideo, activityId: activity.id }];
        }
        return prev;
      });
      setLoadingVideo(null);
      toast.success(`📹 Using existing ${activity.title} video!`);
      return;
    }
    
    try {
      console.log('Creating video for activity:', activity.title);
      
      // Create video with Creatomate API
      const response = await fetch('https://api.creatomate.com/v1/renders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CREATOMATE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template_id: CREATOMATE_TEMPLATE_ID,
          output_format: 'mp4',
          frame_rate: 30,
          modifications: {
            // Try to modify text elements in the template
            "Text": `${dollName}'s ${activity.title}`,
            "text": `${dollName}'s ${activity.title}`,
            "title": `${dollName}'s ${activity.title}`,
            "Title": `${dollName}'s ${activity.title}`,
            "main-text": `${dollName}'s ${activity.title}`,
            "subtitle": activity.description.replace('{dollName}', dollName),
            "Subtitle": activity.description.replace('{dollName}', dollName),
            "description": activity.description.replace('{dollName}', dollName),
            "Description": activity.description.replace('{dollName}', dollName),
            // Try to add the emoji
            "emoji": activity.emoji,
            "Emoji": activity.emoji,
            "icon": activity.emoji,
            "Icon": activity.emoji,
            // Try to add the time
            "time": activity.time,
            "Time": activity.time,
            "timestamp": activity.time,
            "Timestamp": activity.time
          }
        })
      });

      console.log('Creatomate response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Creatomate API error response:', errorText);
        throw new Error(`Creatomate API error: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Creatomate response data:', responseData);
      
      // Handle both single render and array responses
      const renderData = Array.isArray(responseData) ? responseData[0] : responseData;
      
      if (!renderData) {
        throw new Error('No render data received from Creatomate');
      }

      const newRender: VideoRender = {
        id: renderData.id,
        status: renderData.status,
        url: renderData.url,
        activityId: activity.id
      };

      setVideoRenders(prev => [...prev, newRender]);
      
      // Poll for completion
      pollVideoStatus(renderData.id, activity.id, activity.title, cacheKey);
      
      toast.success(`🎬 Creating ${activity.title} video for ${dollName}... This may take 1-2 minutes.`);
      
    } catch (error) {
      console.error('Error creating video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to create video: ${errorMessage}`);
    } finally {
      setLoadingVideo(null);
    }
  };

  const pollVideoStatus = async (renderId: string, activityId: string, activityTitle: string, cacheKey?: string) => {
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        console.log(`Polling video status for ${activityTitle}, attempt ${attempts + 1}`);
        const response = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
          headers: {
            'Authorization': `Bearer ${CREATOMATE_API_KEY}`
          }
        });

        if (response.ok) {
          const renderData = await response.json();
          console.log(`Poll response for ${activityTitle}:`, renderData);
          
          setVideoRenders(prev => 
            prev.map(render => 
              render.id === renderId 
                ? { ...render, status: renderData.status, url: renderData.url, snapshot_url: renderData.snapshot_url }
                : render
            )
          );

          if (renderData.status === 'succeeded') {
            toast.success(`🎉 ${dollName}'s ${activityTitle} video is ready!`);
            // Cache the successful video
            if (cacheKey) {
              setVideoCache(prev => ({
                ...prev,
                [cacheKey]: {
                  id: renderData.id,
                  status: 'succeeded',
                  url: renderData.url,
                  snapshot_url: renderData.snapshot_url,
                  activityId: activityId
                }
              }));
              console.log(`Cached video for ${cacheKey}`);
            }
            // Download video to local storage
            downloadVideo(renderData.url, `${dollName}_${activityId}_activity.mp4`);
            console.log(`Video generation completed for ${dollName} - ${activityTitle}`);
            return; // Stop polling
          } else if (renderData.status === 'failed') {
            toast.error(`❌ Video creation failed for ${activityTitle}`);
            console.error(`Video generation failed for ${dollName} - ${activityTitle}`);
            return; // Stop polling
          } else if ((renderData.status === 'processing' || renderData.status === 'planned') && attempts < maxAttempts) {
            attempts++;
            console.log(`Video still ${renderData.status}... attempt ${attempts}/${maxAttempts} for ${activityTitle}`);
            setTimeout(poll, 10000); // Poll every 10 seconds
          } else if (attempts >= maxAttempts) {
            toast.error(`⏰ Video generation timed out for ${activityTitle}`);
            console.error(`Video generation timed out after ${maxAttempts} attempts`);
            setVideoRenders(prev => 
              prev.map(render => 
                render.id === renderId 
                  ? { ...render, status: 'failed' }
                  : render
              )
            );
            return; // Stop polling
          }
        } else {
          console.error(`Failed to poll video status: ${response.status}`);
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(poll, 10000);
          }
        }
      } catch (error) {
        console.error('Error polling video status:', error);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 10000);
        }
      }
    };

    poll();
  };

  const downloadVideo = async (videoUrl: string, filename: string) => {
    try {
      // Send to server to download and store locally
      const response = await fetch('http://localhost:3001/api/download-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoUrl,
          filename,
          dollId
        })
      });

      if (response.ok) {
        console.log('Video saved locally:', filename);
      }
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  const getVideoRender = (activityId: string) => {
    return videoRenders.find(render => render.activityId === activityId);
  };

  const getTimeIcon = (type: string) => {
    switch (type) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌙';
      default: return '⭐';
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="text-doll-pink" />
          {dollName}'s Daily Adventures
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateTodayActivities}
            className="ml-auto"
          >
            <RefreshCw size={16} className="mr-1" />
            New Day
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          See what {dollName} has been up to today! Generate videos of their adorable daily activities.
        </p>

        <div className="space-y-3">
          {todayActivities.map((activity) => {
            const videoRender = getVideoRender(activity.id);
            const isCreatingVideo = loadingVideo === activity.id;
            
            return (
              <div
                key={activity.id}
                className="border rounded-lg p-4 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{activity.emoji}</span>
                      <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        <Clock size={12} className="mr-1" />
                        {activity.time}
                      </Badge>
                      <span className="text-sm">{getTimeIcon(activity.type)}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                    
                    {videoRender && videoRender.status === 'succeeded' && (
                      <div className="mt-3">
                        <video 
                          src={videoRender.url} 
                          poster={videoRender.snapshot_url}
                          controls 
                          className="w-full max-w-xs rounded-md border"
                          style={{ maxHeight: '200px' }}
                        >
                          Your browser does not support video playback.
                        </video>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {!videoRender ? (
                      <Button
                        size="sm"
                        onClick={() => createVideo(activity)}
                        disabled={isCreatingVideo}
                        className="bg-doll-gradient"
                      >
                        {isCreatingVideo ? (
                          <Loader2 size={16} className="animate-spin mr-1" />
                        ) : (
                          <Play size={16} className="mr-1" />
                        )}
                        {isCreatingVideo ? 'Creating...' : 'Create Video'}
                      </Button>
                    ) : (
                      <div className="text-center space-y-1">
                        {videoRender.status === 'processing' && (
                          <div className="flex flex-col items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                            <Loader2 size={20} className="animate-spin text-blue-600" />
                            <div className="text-sm font-medium text-blue-700">Creating Video...</div>
                            <div className="text-xs text-blue-500">This may take 1-2 minutes</div>
                          </div>
                        )}
                        {videoRender.status === 'succeeded' && (
                          <div className="flex flex-col items-center gap-1 p-2 bg-green-50 rounded-md border border-green-200">
                            <Heart size={16} className="text-green-600" />
                            <div className="text-sm font-medium text-green-700">Video Ready! 🎉</div>
                          </div>
                        )}
                        {videoRender.status === 'failed' && (
                          <div className="flex flex-col items-center gap-1 p-2 bg-red-50 rounded-md border border-red-200">
                            <div className="text-sm font-medium text-red-700">❌ Failed</div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => createVideo(activity)}
                              className="text-xs"
                            >
                              Try Again
                            </Button>
                          </div>
                        )}
                        {videoRender.status === 'planned' && (
                          <div className="flex flex-col items-center gap-2 p-2 bg-yellow-50 rounded-md border border-yellow-200">
                            <Loader2 size={16} className="animate-spin text-yellow-600" />
                            <div className="text-sm font-medium text-yellow-700">Queued...</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-gray-500">
            ✨ Videos are created with AI and stored locally for up to 30 days
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
