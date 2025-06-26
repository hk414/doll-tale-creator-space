import { useState, useEffect, Suspense, Component, ReactNode, ErrorInfo } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Search, Filter, Loader2, Wifi, WifiOff } from "lucide-react";
import { apiClient, type Doll } from "@/lib/api";
import * as THREE from "three";

// Simple 3D preview component for gallery
const DollPreview = ({ modelUrl, dollName }: { modelUrl: string; dollName: string }) => {
  console.log(`Gallery - Loading 3D model for ${dollName} from URL:`, modelUrl);
  
  try {
    const gltf = useGLTF(modelUrl, true); // Enable DRACO loader
    const scene = gltf.scene;
    
    if (!scene) {
      console.warn(`Gallery - No scene loaded for ${dollName}`);
      throw new Error('No scene data');
    }
    
    const clonedScene = scene.clone();
    
    // Scale and position for preview
    clonedScene.scale.setScalar(0.8);
    clonedScene.position.set(0, -0.5, 0);
    
    // Ensure materials render properly
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material.needsUpdate = true;
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.needsUpdate = true;
          });
        }
      }
    });
    
    console.log(`Gallery - 3D model loaded successfully for ${dollName}`);
    return <primitive object={clonedScene} />;
  } catch (error) {
    console.error(`Gallery - Error loading GLB model for ${dollName}:`, error);
    console.error(`Gallery - Model URL that failed:`, modelUrl);
    // Simple fallback placeholder without any SVG elements
    return <SimpleDollPlaceholder />;
  }
};

// Simple fallback component that doesn't use any SVG elements
const SimpleDollPlaceholder = () => {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 1, 0.6]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#FFC0CB" />
      </mesh>
    </group>
  );
};

// Error Boundary component for Canvas errors
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('Gallery ErrorBoundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Gallery ErrorBoundary details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const PreviewFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-doll-pink/10 to-doll-purple/10">
    <div className="text-center">
      <Loader2 className="h-6 w-6 animate-spin text-doll-pink mx-auto mb-2" />
      <p className="text-xs text-gray-500">Loading 3D model...</p>
    </div>
  </div>
);

// Add server status component
const ServerStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dolls');
        setStatus(response.ok ? 'online' : 'offline');
      } catch {
        setStatus('offline');
      }
    };
    
    checkServer();
    const interval = setInterval(checkServer, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant={status === 'online' ? 'default' : 'destructive'} className="flex items-center gap-2">
        {status === 'checking' ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : status === 'online' ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        Server {status === 'checking' ? 'Checking...' : status}
      </Badge>
    </div>
  );
};

export default function Gallery() {
  const navigate = useNavigate();
  const [dolls, setDolls] = useState<Doll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const loadDolls = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Gallery - Fetching dolls from API...');
      const dollsData = await apiClient.getDolls();
      console.log('Gallery - Received dolls data:', dollsData);
      
      // Log model URLs for debugging
      dollsData.forEach(doll => {
        console.log(`Gallery - Doll "${doll.name}" model URL:`, doll.modelUrl);
        
        // Test if the model URL is accessible
        fetch(doll.modelUrl, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              console.log(`✅ Gallery - Model accessible for ${doll.name}:`, response.status);
            } else {
              console.warn(`⚠️ Gallery - Model not accessible for ${doll.name}:`, response.status);
            }
          })
          .catch(error => {
            console.error(`❌ Gallery - Error checking model for ${doll.name}:`, error);
          });
      });
      
      setDolls(dollsData);
    } catch (err) {
      console.error('Gallery - Error loading dolls:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dolls';
      setError(`Failed to load dolls: ${errorMessage}. Make sure the backend server is running on http://localhost:3001`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDolls();
    
    // Preload 3D models to improve loading performance
    const preloadModels = async () => {
      try {
        const dollsData = await apiClient.getDolls();
        console.log('Gallery - Preloading 3D models...');
        
        // Preload the first few models
        dollsData.slice(0, 3).forEach((doll) => {
          if (doll.modelUrl && doll.modelUrl.endsWith('.glb')) {
            console.log(`Gallery - Preloading model for ${doll.name}: ${doll.modelUrl}`);
            useGLTF.preload(doll.modelUrl);
          }
        });
      } catch (error) {
        console.warn('Gallery - Could not preload models:', error);
      }
    };
    
    // Delay preloading slightly to let the main content load first
    setTimeout(preloadModels, 1000);
  }, []);

  const filteredDolls = dolls.filter(doll => {
    const matchesSearch = doll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doll.story.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || doll.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const brands = [...new Set(dolls.map(doll => doll.brand).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-magic-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-doll-pink mb-4" />
          <p className="text-xl text-gray-600">Loading dolls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-magic-gradient flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error loading dolls</h2>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <div className="space-y-3">
            <Button onClick={loadDolls} className="w-full">
              <Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Tip: Make sure the backend server is running in the server folder
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-magic-gradient py-12 px-4">
      <ServerStatus />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Doll <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover magical stories from doll parents around the world
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search dolls by name or story..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedBrand === "" ? "default" : "outline"}
              onClick={() => setSelectedBrand("")}
              size="sm"
            >
              All Brands
            </Button>
            {brands.map(brand => (
              <Button
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                onClick={() => setSelectedBrand(brand)}
                size="sm"
              >
                {brand}
              </Button>
            ))}
          </div>
        </div>

        {/* Dolls Grid */}
        {filteredDolls.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm p-8 text-center">
            <p className="text-gray-600 mb-4">
              {dolls.length === 0 
                ? "No dolls have been uploaded yet. Be the first to share your doll's story!"
                : "No dolls match your search criteria."
              }
            </p>
            <Button onClick={() => navigate('/upload')} className="bg-doll-gradient">
              Upload Your Doll
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDolls.map((doll) => (
              <Card
                key={doll.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm cursor-pointer overflow-hidden"
                onClick={() => navigate(`/doll/${doll.id}`)}
              >
                <div className="aspect-square bg-doll-gradient/10 relative overflow-hidden">
                  {/* 3D Model Preview with Error Boundary */}
                  <div className="w-full h-full">
                    <ErrorBoundary
                      fallback={
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-doll-pink/20 to-doll-purple/20">
                          <div className="text-center p-4">
                            <div className="text-2xl mb-2">🎭</div>
                            <p className="text-xs text-gray-600 mb-2">{doll.name}</p>
                            <p className="text-xs text-gray-500">Loading 3D model...</p>
                          </div>
                        </div>
                      }
                    >
                      <Canvas 
                        camera={{ position: [0, 0, 2], fov: 50 }}
                        onError={(error) => {
                          console.error(`Gallery - Canvas error for ${doll.name}:`, error);
                          return null;
                        }}
                        gl={{ 
                          antialias: true,
                          alpha: true,
                          preserveDrawingBuffer: true,
                          powerPreference: "high-performance"
                        }}
                      >
                        <ambientLight intensity={0.8} />
                        <pointLight position={[5, 5, 5]} intensity={1.0} />
                        <pointLight position={[-5, -5, -5]} intensity={0.5} />
                        <Suspense fallback={<PreviewFallback />}>
                          <DollPreview modelUrl={doll.modelUrl} dollName={doll.name} />
                          <Environment preset="sunset" />
                          <OrbitControls 
                            enablePan={false} 
                            enableZoom={false} 
                            enableRotate={true}
                            autoRotate={true}
                            autoRotateSpeed={2}
                          />
                        </Suspense>
                      </Canvas>
                    </ErrorBoundary>
                  </div>
                  
                  {/* Sticker count indicator */}
                  {doll.stickers && doll.stickers.length > 0 && (
                    <div className="absolute top-2 right-2 bg-doll-coral text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {doll.stickers.length}
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-doll-pink transition-colors">
                      {doll.name}
                    </h3>
                    {doll.brand && (
                      <Badge variant="secondary" className="bg-doll-pink/10 text-doll-pink text-xs">
                        {doll.brand}
                      </Badge>
                    )}
                  </div>
                  
                  {doll.story && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      "{doll.story}"
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-doll-coral">
                      <Heart size={16} className="fill-current" />
                      <span className="text-sm font-medium">
                        {Math.floor(Math.random() * 100) + 50}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-doll-pink hover:text-doll-pink hover:bg-doll-pink/10"
                    >
                      View Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
