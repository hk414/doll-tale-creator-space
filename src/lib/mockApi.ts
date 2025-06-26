export interface Doll {
  id: string;
  name: string;
  story: string;
  brand: string;
  purchaseLocation: string;
  email: string;
  modelUrl: string;
  stickers: Array<{ id: string; type: string; position: [number, number, number] }>;
  voiceProfile?: {
    personalityTraits: string[];
    apiKey?: string;
  };
}

// Mock data for demo purposes - using real 3D models
const mockDolls: Doll[] = [
  {
    id: "1",
    name: "Labubu the Farmer",
    story: "Meet Labubu the Farmer! This adorable character loves tending to crops and exploring the countryside. Always ready for outdoor adventures and making friends with farm animals!",
    brand: "Pop Mart",
    purchaseLocation: "Pop Mart Store",
    email: "labubu.farmer@example.com",
    modelUrl: "/doll-tale-creator-space/models/a08c3384-4b30-4883-a584-e89074f51f7c-labubu_-_farmer.glb",
    stickers: [
      { id: "s1", type: "star", position: [0.5, 0.8, 0.1] },
      { id: "s2", type: "heart", position: [-0.3, 0.6, 0.1] }
    ],
    voiceProfile: {
      personalityTraits: ["cheerful", "hardworking", "nature-loving"]
    }
  },
  {
    id: "2", 
    name: "Labubu CNY Edition",
    story: "Celebrating the Chinese New Year with Labubu! This special edition brings luck, prosperity, and festive joy. Perfect for spreading happiness during the lunar celebrations!",
    brand: "Pop Mart",
    purchaseLocation: "Pop Mart CNY Collection",
    email: "labubu.cny@example.com",
    modelUrl: "/doll-tale-creator-space/models/f1b38f66-e1a6-4f98-83a6-e012c972c54e-labubu_cny.glb",
    stickers: [
      { id: "s3", type: "fireworks", position: [0.2, 0.9, 0.1] }
    ],
    voiceProfile: {
      personalityTraits: ["festive", "lucky", "joyful"]
    }
  },
  {
    id: "3",
    name: "Luigi Doll HD",
    story: "It's-a me, Luigi! The brave brother in green is here for all your adventures. Whether jumping through pipes or exploring mysterious mansions, Luigi is your loyal companion!",
    brand: "Nintendo",
    purchaseLocation: "Nintendo Store",
    email: "luigi@example.com", 
    modelUrl: "/doll-tale-creator-space/models/59408d8a-5df1-48d4-a080-5052637ca15a-luigi_doll_hd.glb",
    stickers: [
      { id: "s4", type: "mushroom", position: [0.4, 0.7, 0.1] },
      { id: "s5", type: "coin", position: [-0.2, 0.5, 0.1] }
    ],
    voiceProfile: {
      personalityTraits: ["brave", "loyal", "adventurous"]
    }
  },
  {
    id: "4",
    name: "Build-A-Bear Friend",
    story: "This special Build-A-Bear friend is filled with love and cuddles! Created with care and personalized just for you. Every hug brings warmth and happiness!",
    brand: "Build-A-Bear Workshop",
    purchaseLocation: "Build-A-Bear Workshop",
    email: "bear@example.com",
    modelUrl: "/doll-tale-creator-space/models/c760f85a-74c5-492e-9719-9cb0f2acfc88-build_a_bear.glb",
    stickers: [
      { id: "s6", type: "heart", position: [0.0, 0.6, 0.1] },
      { id: "s7", type: "rainbow", position: [0.3, 0.4, 0.1] }
    ],
    voiceProfile: {
      personalityTraits: ["cuddly", "loving", "gentle"]
    }
  }
];

export const mockApiClient = {
  async getDolls(): Promise<Doll[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDolls;
  },

  async getDoll(id: string): Promise<Doll> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const doll = mockDolls.find(d => d.id === id);
    if (!doll) {
      throw new Error('Doll not found');
    }
    return doll;
  },

  async uploadDoll(formData: any): Promise<Doll> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDoll: Doll = {
      id: String(mockDolls.length + 1),
      name: formData.name,
      story: formData.story,
      brand: formData.brand,
      purchaseLocation: formData.purchaseLocation,
      email: formData.email,
      modelUrl: "/placeholder.svg",
      stickers: [],
      voiceProfile: {
        personalityTraits: ["friendly", "playful"]
      }
    };
    
    mockDolls.push(newDoll);
    return newDoll;
  },

  async addSticker(dollId: string, type: string, position: [number, number, number]) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const sticker = {
      id: `s${Date.now()}`,
      type,
      position
    };
    
    const doll = mockDolls.find(d => d.id === dollId);
    if (doll) {
      doll.stickers.push(sticker);
    }
    
    return sticker;
  },

  async removeSticker(dollId: string, stickerId: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const doll = mockDolls.find(d => d.id === dollId);
    if (doll) {
      doll.stickers = doll.stickers.filter(s => s.id !== stickerId);
    }
  },

  async generateVoice(dollId: string, text: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock audio URL
    return {
      audioUrl: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D..."
    };
  }
};
