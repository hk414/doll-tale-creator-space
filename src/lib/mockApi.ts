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

// Mock data for demo purposes
const mockDolls: Doll[] = [
  {
    id: "1",
    name: "Bella the Ballerina",
    story: "Bella loves to dance and dreams of performing on stage. She practices every day and teaches other dolls how to pirouette!",
    brand: "DreamDance Dolls",
    purchaseLocation: "Magical Toy Store",
    email: "bella@example.com",
    modelUrl: "/placeholder.svg",
    stickers: [
      { id: "s1", type: "star", position: [0.5, 0.8, 0.1] },
      { id: "s2", type: "heart", position: [-0.3, 0.6, 0.1] }
    ],
    voiceProfile: {
      personalityTraits: ["cheerful", "energetic", "encouraging"]
    }
  },
  {
    id: "2", 
    name: "Max the Explorer",
    story: "Max is always ready for adventure! He carries a tiny backpack and loves discovering new places and making friends along the way.",
    brand: "Adventure Kids",
    purchaseLocation: "Toy Kingdom",
    email: "max@example.com",
    modelUrl: "/placeholder.svg",
    stickers: [
      { id: "s3", type: "compass", position: [0.2, 0.9, 0.1] }
    ],
    voiceProfile: {
      personalityTraits: ["curious", "brave", "friendly"]
    }
  },
  {
    id: "3",
    name: "Luna the Artist",
    story: "Luna sees magic in colors and shapes. She loves painting rainbows and drawing pictures of her doll friends!",
    brand: "Creative Companions",
    purchaseLocation: "Art & Craft Store",
    email: "luna@example.com", 
    modelUrl: "/placeholder.svg",
    stickers: [
      { id: "s4", type: "palette", position: [0.4, 0.7, 0.1] },
      { id: "s5", type: "rainbow", position: [-0.2, 0.5, 0.1] }
    ],
    voiceProfile: {
      personalityTraits: ["creative", "imaginative", "gentle"]
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
