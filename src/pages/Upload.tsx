
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon, File, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

export default function Upload() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [dollData, setDollData] = useState({
    name: "",
    story: "",
    brand: "",
    purchaseLocation: "",
    email: "",
    modelFile: null as File | null
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setDollData(prev => ({ ...prev, modelFile: acceptedFiles[0] }));
        toast.success("3D model uploaded successfully!");
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dollData.modelFile || !dollData.name) {
      toast.error("Please upload a 3D model and enter a doll name");
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadedDoll = await apiClient.uploadDoll({
        name: dollData.name,
        story: dollData.story,
        brand: dollData.brand,
        purchaseLocation: dollData.purchaseLocation,
        email: dollData.email,
        modelFile: dollData.modelFile
      });

      toast.success("Your doll has been uploaded! Redirecting to customize...");
      setTimeout(() => navigate(`/doll/${uploadedDoll.id}`), 1500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to upload doll. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-magic-gradient py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Upload Your <span className="text-gradient">Beloved Doll</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your doll's story and bring them to life in 3D
          </p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-doll-pink/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Star className="text-doll-pink" />
              Tell Us About Your Doll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 3D Model Upload */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">3D Model Upload</Label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-doll-pink bg-doll-pink/10' 
                      : 'border-gray-300 hover:border-doll-pink hover:bg-doll-pink/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  {dollData.modelFile ? (
                    <div className="space-y-2">
                      <File className="mx-auto text-doll-pink" size={48} />
                      <p className="text-lg font-medium text-doll-pink">{dollData.modelFile.name}</p>
                      <p className="text-sm text-gray-600">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <UploadIcon className="mx-auto text-gray-400" size={48} />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive ? 'Drop your 3D model here!' : 'Drag & drop your 3D model'}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Supports GLB and GLTF files
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Doll Name */}
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold">Doll Name *</Label>
                  <Input
                    id="name"
                    value={dollData.name}
                    onChange={(e) => setDollData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="What's your doll's name?"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Brand Selection */}
                <div>
                  <Label className="text-lg font-semibold">Brand</Label>
                  <Select onValueChange={(value) => setDollData(prev => ({ ...prev, brand: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select doll brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jellycat">Jellycat</SelectItem>
                      <SelectItem value="labubu">Labubu</SelectItem>
                      <SelectItem value="loopy">Loopy</SelectItem>
                      <SelectItem value="build-a-bear">Build-A-Bear</SelectItem>
                      <SelectItem value="squishmallows">Squishmallows</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Doll Story */}
              <div>
                <Label htmlFor="story" className="text-lg font-semibold">Your Doll's Story</Label>
                <Textarea
                  id="story"
                  value={dollData.story}
                  onChange={(e) => setDollData(prev => ({ ...prev, story: e.target.value }))}
                  placeholder="Tell us why this doll is special to you..."
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Purchase Location */}
                <div>
                  <Label htmlFor="location" className="text-lg font-semibold">Where did you get this doll?</Label>
                  <Input
                    id="location"
                    value={dollData.purchaseLocation}
                    onChange={(e) => setDollData(prev => ({ ...prev, purchaseLocation: e.target.value }))}
                    placeholder="Store, online, gift, etc."
                    className="mt-2"
                  />
                </div>

                {/* Email for follow-up */}
                <div>
                  <Label htmlFor="email" className="text-lg font-semibold">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={dollData.email}
                    onChange={(e) => setDollData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="For updates and special offers"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Back to Home
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading || !dollData.modelFile || !dollData.name}
                  className="flex-1 bg-doll-gradient hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload & Customize"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
