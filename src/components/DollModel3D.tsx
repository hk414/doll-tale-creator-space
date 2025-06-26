
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Html, useGLTF } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Heart, Star, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";

interface Sticker {
  id: string;
  type: string;
  position: [number, number, number];
}

interface DollModel3DProps {
  dollName: string;
  modelUrl: string;
  stickers: Sticker[];
  onStickerAdd: (position: [number, number, number]) => void;
  onStickerRemove: (stickerId: string) => void;
  maxStickers?: number;
}

const DollModel = ({ modelUrl }: { modelUrl: string }) => {
  console.log('Loading 3D model from URL:', modelUrl); // Debug log
  
  try {
    const { scene } = useGLTF(modelUrl);
    
    // Clone the scene to avoid issues with multiple instances
    const clonedScene = scene.clone();
    
    // Scale and position the model appropriately
    clonedScene.scale.setScalar(1);
    clonedScene.position.set(0, -1, 0);
    
    // Ensure materials are properly set up
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Ensure materials render properly
        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });
    
    console.log('3D model loaded successfully:', clonedScene); // Debug log
    return <primitive object={clonedScene} />;
  } catch (error) {
    console.error('Error loading GLB model:', error);
    // Fallback to placeholder if model fails to load
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1.5, 0.8]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
        <Text
          position={[0, 1, 0]}
          fontSize={0.2}
          color="#FF69B4"
          anchorX="center"
          anchorY="middle"
        >
          Model Loading Failed
        </Text>
      </group>
    );
  }
};

const LoadingFallback = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-doll-pink">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Loading your doll...</p>
      </div>
    </Html>
  );
};

const StickerOverlay = ({ sticker, onRemove }: { sticker: Sticker, onRemove: () => void }) => {
  const icons = {
    heart: Heart,
    star: Star,
    sparkle: Sparkles
  };
  const Icon = icons[sticker.type as keyof typeof icons] || Heart;
  
  return (
    <Html position={sticker.position}>
      <div className="relative group">
        <Icon 
          size={24} 
          className="text-doll-coral animate-pulse cursor-pointer hover:scale-110 transition-transform" 
        />
        <button
          onClick={onRemove}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </Html>
  );
};

export const DollModel3D = ({ 
  dollName, 
  modelUrl, 
  stickers, 
  onStickerAdd, 
  onStickerRemove,
  maxStickers = 3 
}: DollModel3DProps) => {
  const [selectedSticker, setSelectedSticker] = useState<string>("");
  const [isPlacingSticker, setIsPlacingSticker] = useState(false);

  const addSticker = (position: [number, number, number]) => {
    if (!selectedSticker || stickers.length >= maxStickers) return;
    onStickerAdd(position);
    setIsPlacingSticker(false);
    setSelectedSticker("");
    toast.success("Sticker added!");
  };

  const handleStickerSelection = (stickerType: string) => {
    if (stickers.length >= maxStickers) {
      toast.error(`Maximum ${maxStickers} stickers allowed!`);
      return;
    }
    setSelectedSticker(stickerType);
    setIsPlacingSticker(true);
    // Simulate 3D click placement
    setTimeout(() => addSticker([Math.random() - 0.5, Math.random() - 0.5, 0.5]), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gradient-to-b from-doll-lavender/20 to-doll-pink/20 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={<LoadingFallback />}>
            <DollModel modelUrl={modelUrl} />
            <Environment preset="sunset" />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            
            {stickers.map((sticker) => (
              <StickerOverlay
                key={sticker.id}
                sticker={sticker}
                onRemove={() => onStickerRemove(sticker.id)}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {['heart', 'star', 'sparkle'].map((stickerType) => (
          <Button
            key={stickerType}
            variant={selectedSticker === stickerType ? "default" : "outline"}
            className="aspect-square p-2"   
            onClick={() => handleStickerSelection(stickerType)}
            disabled={stickers.length >= maxStickers}
            size="sm"
          >
            {stickerType === 'heart' && <Heart size={16} />}
            {stickerType === 'star' && <Star size={16} />}
            {stickerType === 'sparkle' && <Sparkles size={16} />}
          </Button>
        ))}
      </div>
      
      {isPlacingSticker && (
        <p className="text-center text-doll-pink font-medium animate-pulse text-sm">
          Click on {dollName} to place the sticker!
        </p>
      )}
    </div>
  );
};
