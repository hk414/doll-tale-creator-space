const API_BASE_URL = 'http://localhost:3001/api';

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

export interface DollFormData {
  name: string;
  story: string;
  brand: string;
  purchaseLocation: string;
  email: string;
  modelFile: File;
}

class ApiClient {
  async uploadDoll(formData: DollFormData): Promise<Doll> {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('story', formData.story);
    data.append('brand', formData.brand);
    data.append('purchaseLocation', formData.purchaseLocation);
    data.append('email', formData.email);
    data.append('modelFile', formData.modelFile);

    const response = await fetch(`${API_BASE_URL}/dolls`, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload doll');
    }

    return response.json();
  }

  async getDolls(): Promise<Doll[]> {
    try {
      console.log('API - Fetching dolls from:', `${API_BASE_URL}/dolls`);
      const response = await fetch(`${API_BASE_URL}/dolls`);
      
      console.log('API - Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (parseError) {
          console.error('API - Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API - Successfully fetched dolls:', data.length, 'dolls');
      return data;
    } catch (error) {
      console.error('API - Fetch error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 3001.');
      }
      throw error;
    }
  }

  async getDoll(id: string): Promise<Doll> {
    const response = await fetch(`${API_BASE_URL}/dolls/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch doll');
    }

    return response.json();
  }

  async addSticker(dollId: string, type: string, position: [number, number, number]): Promise<{ id: string; type: string; position: [number, number, number] }> {
    const response = await fetch(`${API_BASE_URL}/dolls/${dollId}/stickers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, position }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add sticker');
    }

    return response.json();
  }

  async removeSticker(dollId: string, stickerId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/dolls/${dollId}/stickers/${stickerId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove sticker');
    }
  }

  async saveVoiceProfile(dollId: string, audioBlob: Blob, personalityTraits: string[], apiKey?: string): Promise<void> {
    console.log('API - saveVoiceProfile called with:', {
      dollId,
      audioBlobSize: audioBlob.size,
      personalityTraits,
      apiKey: apiKey ? 'provided' : 'not provided'
    });
    
    const formData = new FormData();
    formData.append('personalityTraits', JSON.stringify(personalityTraits));
    if (apiKey) {
      formData.append('apiKey', apiKey);
    }
    if (audioBlob) {
      formData.append('audioFile', audioBlob, 'voice-recording.wav');
    }

    console.log('API - Sending request to:', `${API_BASE_URL}/dolls/${dollId}/voice`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/dolls/${dollId}/voice`, {
        method: 'POST',
        body: formData,
      });

      console.log('API - Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
          console.error('API - Server error response:', error);
        } catch (parseError) {
          console.error('API - Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('API - Success response:', result);
    } catch (error) {
      console.error('API - Request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 3001.');
      }
      throw error;
    }
  }

  // Brand API methods
  async getBrandAnalytics(brandId: string): Promise<any> {
    try {
      console.log('API - Getting brand analytics for:', brandId);
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}/analytics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch brand analytics');
      }
      
      return response.json();
    } catch (error) {
      console.error('API - Failed to get brand analytics:', error);
      throw error;
    }
  }

  async getBrandCampaigns(brandId: string): Promise<any[]> {
    try {
      console.log('API - Getting brand campaigns for:', brandId);
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}/campaigns`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch brand campaigns');
      }
      
      return response.json();
    } catch (error) {
      console.error('API - Failed to get brand campaigns:', error);
      throw error;
    }
  }

  async createBrandCampaign(brandId: string, campaignData: any): Promise<any> {
    try {
      console.log('API - Creating brand campaign for:', brandId, campaignData);
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create brand campaign');
      }
      
      return response.json();
    } catch (error) {
      console.error('API - Failed to create brand campaign:', error);
      throw error;
    }
  }

  async getBrandCustomers(brandId: string): Promise<any[]> {
    try {
      console.log('API - Getting brand customers for:', brandId);
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}/customers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch brand customers');
      }
      
      return response.json();
    } catch (error) {
      console.error('API - Failed to get brand customers:', error);
      throw error;
    }
  }

  async getBrandProfile(brandId: string): Promise<any> {
    try {
      console.log('API - Getting brand profile for:', brandId);
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}/profile`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch brand profile');
      }
      
      return response.json();
    } catch (error) {
      console.error('API - Failed to get brand profile:', error);
      throw error;
    }
  }

  async updateBrandProfile(brandId: string, profileData: any): Promise<any> {
    try {
      console.log('API - Updating brand profile for:', brandId, profileData);
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update brand profile');
      }
      
      return response.json();
    } catch (error) {
      console.error('API - Failed to update brand profile:', error);
      throw error;
    }
  }

  async getBrandPartnerships(brandId: string): Promise<any[]> {
    try {
      console.log('API - Getting brand partnerships for:', brandId);
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}/partnerships`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch brand partnerships');
      }
      
      return response.json();
    } catch (error) {
      console.error('API - Failed to get brand partnerships:', error);
      throw error;
    }
  }

  async getFeaturedBrands(): Promise<any[]> {
    try {
      console.log('API - Getting featured brands');
      const response = await fetch(`${API_BASE_URL}/brands/featured`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured brands');
      }
      
      return response.json();
    } catch (error) {
      console.error('API - Failed to get featured brands:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
