# DolLife - Microsoft Intern Hackathon 2025

Transform your beloved doll into a magical 3D experience. Share their story, add sparkles, and create memories that last forever. This platform empowers brands to tell their unique stories and connect with collectors, while users can share their own experiences and build meaningful, two-way relationships with both brands and their dolls through AI-powered interactions using images, voices etc.

**Watch the demo here:** [https://youtu.be/H_Tppx_51Kk](https://youtu.be/H_Tppx_51Kk)

## Overview

A comprehensive platform that combines 3D doll visualization, AI-powered chat experiences, daily activities with video generation, and brand marketing tools. Create immersive experiences for doll collectors while providing brands with powerful customer relationship management capabilities.

## Key Features

**3D Doll Visualization** - Upload and display dolls in interactive 3D environments  
**AI Voice Chat** - Have conversations with your dolls using OpenAI and ElevenLabs  
**Daily Activities** - Generate videos of your doll's daily adventures  
**Brand Marketing Hub** - Complete CRM and marketing tools for doll brands  
**Analytics Dashboard** - Track engagement, sales, and customer relationships  
**Customer Engagement** - Loyalty programs, campaigns, and personalized experiences

## Core Features

### 3D Doll Experience
- **Upload & Display**: Support for GLB/GLTF 3D models (up to 50MB)
- **Interactive Viewing**: Rotate, zoom, and inspect your dolls in 3D space
- **Sticker System**: Add virtual stickers with 3D positioning
- **Gallery View**: Browse all dolls with 3D previews
- **Model Validation**: Automatic error handling and fallback displays

### AI-Powered Voice Chat
- **Personality Setup**: Record voice samples and define personality traits
- **Natural Conversations**: OpenAI GPT-3.5-turbo for intelligent responses
- **Premium Voice Synthesis**: ElevenLabs for high-quality, child-like doll voices
- **Emotional Support**: Dolls provide caring, empathetic responses
- **Voice Settings**: Optimized for doll-like speech characteristics
- **Fallback TTS**: Browser text-to-speech when premium services unavailable

### Daily Activities & Video Generation
- **Random Activities**: 3-5 daily activities per doll (morning, afternoon, evening)
- **Video Creation**: AI-generated 5-second videos using Creatomate API
- **Activity Types**: 
  - Morning: Stretches, tea time, snack time
  - Afternoon: Garden play, reading, art creation
  - Evening: Sunset watch, bedtime stories, dream prep
  - Anytime: Music dance, friend visits, bubble play
- **Local Storage**: Videos saved to `server/uploads/videos/`
- **Cost Efficient**: 5-second limit keeps generation costs low (~$0.10-0.30/video)

### Brand Marketing Platform
- **Brand Dashboard**: Centralized management hub with real-time metrics
- **Customer Relationships**: Tier system (Bronze/Silver/Gold/Platinum)
- **Marketing Campaigns**: Email, push notifications, social media, rewards
- **Analytics & Insights**: Revenue trends, customer behavior, engagement metrics
- **Professional Profiles**: Brand verification, partnerships, achievements
- **Direct Communication**: Brand-to-customer messaging and support

### Analytics & Reporting
- **Revenue Tracking**: Monthly trends, order values, conversion rates
- **Customer Analytics**: Acquisition, retention, lifetime value
- **Product Performance**: Top dolls, collection analysis
- **Engagement Metrics**: Chat activity, voice usage, video generation
- **Campaign Performance**: Email opens, clicks, conversions

## Project Structure

This project consists of:
- **Frontend**: React + TypeScript + Vite application with 3D rendering
- **Backend**: Express.js server with SQLite database for persistent storage
- **AI Integration**: OpenAI for chat, ElevenLabs for voice synthesis
- **Video Generation**: Creatomate API for automated video creation
- **Brand System**: Complete marketing and CRM platform

## Technologies Used

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS, Three.js, React Three Fiber
- **Backend**: Express.js, SQLite3, Multer (file uploads), CORS
- **AI Services**: OpenAI GPT-3.5-turbo, ElevenLabs text-to-speech
- **Video Generation**: Creatomate API
- **3D Models**: GLB/GLTF format support with Three.js loading

## How to Run This Project

### Prerequisites

- Node.js (v16 or higher)
- npm or Bun package manager
- API keys for OpenAI and ElevenLabs (optional but recommended)

### Quick Start (Recommended)

1. **Navigate to project directory**:
   ```powershell
   cd "c:\path\to\doll-tale-creator-space"
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   # This automatically installs both frontend and backend dependencies
   ```

3. **Configure environment variables** (Important):
   ```powershell
   # Copy the example file
   copy .env.example .env
   
   # Edit with your API keys
   notepad .env
   ```

4. **Start the application**:
   ```powershell
   npm run dev:full
   ```

   This launches:
   - Backend server: `http://localhost:3001`
   - Frontend app: `http://localhost:8080`

### Alternative: Manual Setup
```powershell
# Terminal 1 - Backend
cd server
npm install
node server.js

# Terminal 2 - Frontend
npm run dev
```

## Environment Variables

The application uses environment variables for API configuration. Create a `.env` file in the root directory:

```powershell
# Copy the example file
copy .env .env.local  # Optional: create a local copy

# Edit the .env file with your API keys
notepad .env
```

### Required Environment Variables

- `VITE_ELEVENLABS_API_KEY`: Your ElevenLabs API key for text-to-speech
- `VITE_ELEVENLABS_VOICE_ID`: ElevenLabs voice ID for the doll's voice
- `VITE_OPENAI_API_KEY`: Your OpenAI API key for chat functionality

## Environment Variables Configuration

### Required Variables

Create a `.env` file in the root directory with these values:

```env
# ElevenLabs API Configuration (for premium voice synthesis)
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
VITE_ELEVENLABS_VOICE_ID=your_voice_id_here

# OpenAI API Configuration (for AI chat functionality)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Getting API Keys

#### ElevenLabs Setup (Text-to-Speech):
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from the dashboard
3. Choose or create a voice and copy the voice ID
4. Cost: ~$0.30 per 1K characters (very affordable for doll chat)

#### OpenAI Setup (AI Chat):
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Create an API key in account settings
3. Ensure you have credits available
4. Cost: Standard GPT-3.5-turbo pricing

### Important Notes
- **VITE_ Prefix**: All variables must start with `VITE_` for frontend access
- **Fallback Behavior**: App works without API keys but with limited functionality
- **Security**: Never commit `.env` file to version control
- **Free Tiers**: Both services offer free credits for new users

### Without API Keys
- **Voice**: Falls back to browser text-to-speech with optimized settings
- **Chat**: Uses predefined friendly responses instead of AI generation

## Features

### Database Storage
- **SQLite Database**: All doll data is stored in `server/dolls.db`
- **File Storage**: 3D models are stored in `server/uploads/` directory
- **Data Persistence**: Unlike the previous localStorage approach, your data persists across sessions

### API Endpoints

- `POST /api/dolls` - Upload a new doll with 3D model
- `GET /api/dolls` - Get all dolls
- `GET /api/dolls/:id` - Get specific doll
- `POST /api/dolls/:id/stickers` - Add sticker to doll
- `DELETE /api/dolls/:dollId/stickers/:stickerId` - Remove sticker
- `POST /api/dolls/:id/voice` - Save voice profile

## API Documentation

### Doll Management
- `POST /api/dolls` - Upload new doll with 3D model
- `GET /api/dolls` - Retrieve all dolls with metadata
- `GET /api/dolls/:id` - Get specific doll details
- `PUT /api/dolls/:id` - Update doll information
- `DELETE /api/dolls/:id` - Remove doll and associated files

### Sticker System
- `POST /api/dolls/:id/stickers` - Add sticker to doll
- `GET /api/dolls/:id/stickers` - Get all stickers for doll
- `PUT /api/dolls/:dollId/stickers/:stickerId` - Update sticker position
- `DELETE /api/dolls/:dollId/stickers/:stickerId` - Remove sticker

### Voice Profiles
- `POST /api/dolls/:id/voice` - Save voice recording and traits
- `GET /api/dolls/:id/voice` - Retrieve voice profile
- `PUT /api/dolls/:id/voice` - Update personality traits
- `DELETE /api/dolls/:id/voice` - Remove voice profile

### File Serving
- `GET /uploads/:filename` - Serve 3D models, audio, and videos
- `POST /api/download-video` - Download and store Creatomate videos locally

### Brand APIs (Future)
- `GET /api/brands/:id/analytics` - Brand performance metrics
- `POST /api/brands/:id/campaigns` - Create marketing campaigns
- `GET /api/brands/:id/customers` - Customer relationship data

## File Format Support

### 3D Models
- **Formats**: GLB, GLTF
- **Size Limit**: 50MB per file
- **Validation**: Automatic format verification
- **Storage**: Local filesystem with unique naming
- **Loading**: Three.js with React Three Fiber

### Audio Files
- **Format**: WAV (for voice recordings)
- **Purpose**: Personality context and voice samples
- **Integration**: Used with ElevenLabs voice cloning

### Video Generation
- **Output**: MP4 format, 30fps
- **Duration**: 5 seconds maximum
- **Templates**: Creatomate template-based generation
- **Cost**: ~$0.10-0.30 per video

## Available Scripts

### Development
- `npm run dev` - Frontend only (port 8080)
- `npm run dev:server` - Backend only (port 3001)
- `npm run dev:full` - Both servers concurrently
- `npm run server:install` - Install server dependencies

### Production
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

### Utilities
- `npm install` - Install all dependencies (includes postinstall hook)

## Application Architecture

### Frontend Structure
```
src/
├── pages/
│   ├── Index.tsx              # Landing page with brand showcase
│   ├── Upload.tsx             # Doll upload and creation
│   ├── Gallery.tsx            # 3D gallery with previews
│   ├── DollViewer.tsx         # Individual doll details
│   ├── BrandDashboard.tsx     # Brand management hub
│   ├── BrandMarketing.tsx     # Campaign management
│   ├── BrandAnalytics.tsx     # Performance insights
│   └── BrandProfile.tsx       # Brand settings
├── components/
│   ├── DollModel3D.tsx        # 3D model renderer
│   ├── VoiceRecorder.tsx      # Voice profile setup
│   ├── DollChat.tsx           # AI chat interface
│   ├── DollActivities.tsx     # Daily activities & videos
│   ├── BrandShowcase.tsx      # Featured brands display
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── api.ts                 # API client with TypeScript
│   └── utils.ts               # Utility functions
└── hooks/
    ├── use-mobile.tsx         # Mobile detection
    └── use-toast.ts           # Toast notifications
```

### Backend Structure
```
server/
├── server.js                  # Express.js API server
├── package.json               # Server dependencies
├── dolls.db                   # SQLite database (auto-created)
└── uploads/
    ├── *.glb                  # 3D model files
    ├── *-voice-recording.wav  # Voice profiles
    └── videos/
        └── *_activity.mp4     # Generated activity videos
```

### Database Schema
```sql
-- Core doll information
CREATE TABLE dolls (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  story TEXT,
  brand TEXT,
  purchase_location TEXT,
  email TEXT,
  model_filename TEXT,
  model_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3D sticker positions
CREATE TABLE stickers (
  id TEXT PRIMARY KEY,
  doll_id TEXT,
  type TEXT NOT NULL,
  position_x REAL,
  position_y REAL,
  position_z REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doll_id) REFERENCES dolls (id)
);

-- Voice profiles and personality
CREATE TABLE voice_profiles (
  id TEXT PRIMARY KEY,
  doll_id TEXT UNIQUE,
  audio_filename TEXT,
  personality_traits TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doll_id) REFERENCES dolls (id)
);

-- Brand information (planned)
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  tier TEXT DEFAULT 'starter',
  verified BOOLEAN DEFAULT false
);
```

## Troubleshooting

### Common Issues & Solutions

#### "Failed to fetch dolls" Error
1. **Check Backend Status**: Look for server status indicator (green = online, red = offline)
2. **Verify Server Running**: 
   ```powershell
   cd server
   node server.js
   # Should show: "Server running on http://localhost:3001"
   ```
3. **Test API Directly**:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:3001/api/dolls -Method GET
   ```
4. **Check Database**: Ensure `server/dolls.db` exists (auto-created on first run)

#### Gallery Loading Issues
- **No 3D Previews**: Verify GLB files exist in `server/uploads/`
- **Slow Loading**: Large models (>10MB) load slowly - consider compression
- **Console Errors**: Check browser DevTools for Three.js loading errors
- **Cache Issues**: Hard refresh with `Ctrl+Shift+R`

#### Voice Chat Problems
1. **Save Button Disabled**: 
   - Record voice first
   - Add personality traits
   - Check debug info under button
2. **No Voice Playback**: 
   - Verify ElevenLabs API key in `.env`
   - Check browser console for API errors
   - System falls back to browser TTS automatically
3. **No Chat Responses**: 
   - Add OpenAI API key to `.env`
   - Verify API key has available credits
   - Check for API rate limits

#### Video Generation Issues
1. **"Creating..." Stuck**: 
   - Check Creatomate API key configuration
   - Verify template ID is correct
   - Monitor Creatomate dashboard for errors
2. **Videos Not Downloading**: 
   - Ensure `server/uploads/videos/` directory exists
   - Check server console for download errors
   - Verify sufficient disk space

#### Port Conflicts
- **Backend Port 3001**: Modify in `server/server.js` line 12
- **Frontend Port 8080**: Change in `vite.config.ts`
- **Update API URL**: Adjust in `src/lib/api.ts`

#### File Upload Problems
- **Size Limits**: GLB/GLTF files must be under 50MB
- **Format Validation**: Only GLB and GLTF formats supported
- **Upload Directory**: `server/uploads/` created automatically
- **Permissions**: Ensure write access to uploads folder

#### Database Issues
- **Reset Data**: Delete `server/dolls.db` and restart server
- **Backup**: Copy database file before major changes
- **Migration**: Database schema updates handled automatically

### Performance Optimization

#### Large 3D Models
- Use GLB format (more efficient than GLTF)
- Compress textures before upload
- Consider using tools like `gltf-pipeline` for optimization
- Limit polygon count for better performance

#### Voice & Video Costs
- Monitor API usage in respective dashboards
- Consider caching generated content
- Use 5-second video limit to control costs
- Batch generate content during off-peak hours

### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **WebGL Required**: For 3D model rendering
- **Audio Support**: For voice recording and playback
- **ES Modules**: Modern browser required for Vite

## Brand Marketing Features

### For Doll Brands

#### Dashboard & Analytics (`/brand/dashboard`)
- **Real-time Metrics**: Total dolls, customers, engagement, revenue
- **Customer Segmentation**: Bronze/Silver/Gold/Platinum tiers
- **Performance Tracking**: Growth trends and KPIs
- **Quick Actions**: Campaign creation, customer management

#### Marketing Hub (`/brand/marketing`)
- **Campaign Types**:
  - Email marketing campaigns
  - Push notifications
  - Social media campaigns
  - Loyalty reward programs
- **Templates**: Pre-built campaigns for common scenarios
- **Audience Targeting**: Customer segmentation and personalization
- **Performance Metrics**: Open rates, click-through, conversions

#### Customer Relationship Management
- **Tier System**: Automatic customer classification based on engagement
- **Direct Messaging**: Brand-to-customer communication
- **Purchase History**: Track customer buying patterns
- **Engagement Scoring**: Measure customer loyalty and activity
- **Personalized Offers**: Targeted promotions and discounts

#### Brand Profile Management (`/brand/profile`)
- **Professional Presence**: Verified brand badges and descriptions
- **Partnership Tracking**: Collaboration and affiliate management
- **Achievement System**: Milestones and certifications
- **Brand Tiers**: Starter, Standard, Premium partnership levels

### For Customers

#### Enhanced Experience
- **Personalized Recommendations**: Based on preferences and history
- **Exclusive Access**: Early product launches and member benefits
- **Loyalty Rewards**: Points system and tier-based perks
- **Community Features**: Connect with other collectors
- **Direct Brand Communication**: Easy access to support and updates

#### Brand Discovery
- **Featured Brands**: Prominent display on homepage
- **Brand Showcase**: Professional brand presentations
- **Partnership Benefits**: Exclusive collaborations and offers
- **Verified Badges**: Trust indicators for authentic brands

## Future Roadmap

### Planned Features
1. **Mobile Application**: Dedicated iOS/Android apps
2. **Social Features**: Community forums and user-generated content
3. **Marketplace**: Direct purchasing within the platform
4. **AR/VR Support**: Augmented reality doll viewing
5. **AI Personalization**: Machine learning-based recommendations
6. **Advanced Analytics**: Predictive insights and trend analysis

### Integration Opportunities
- **E-commerce Platforms**: Shopify, WooCommerce integration
- **CRM Systems**: Salesforce, HubSpot connectivity
- **Social Media**: Instagram, TikTok, YouTube APIs
- **Email Services**: Mailchimp, SendGrid integration
- **Payment Processing**: Stripe, PayPal integration

### Technology Enhancements
- **Cloud Storage**: AWS S3 or Google Cloud for file storage
- **CDN Integration**: Faster global content delivery
- **Real-time Features**: WebSocket integration for live chat
- **Advanced 3D**: Improved rendering and animation capabilities
- **Voice Cloning**: ElevenLabs voice cloning for personalized doll voices

## Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Follow existing code style and conventions
4. Add tests for new functionality
5. Update documentation as needed
6. Submit pull request with detailed description

### Code Style
- TypeScript for all new code
- ESLint configuration provided
- Tailwind CSS for styling
- React functional components with hooks
- RESTful API design principles

## License & Support

This project is developed for educational and demonstration purposes. For commercial use, ensure you have appropriate licenses for all APIs and services used.

### Support Channels
- Check this README for common issues
- Review browser console for error messages
- Verify API key configuration
- Test with minimal examples first

### API Service Support
- **OpenAI**: [Platform Support](https://platform.openai.com/docs)
- **ElevenLabs**: [Documentation](https://elevenlabs.io/docs)
- **Creatomate**: [API Docs](https://creatomate.com/docs)

---

Transform your doll collecting experience with AI-powered conversations, stunning 3D visuals, and meaningful brand relationships! 🎭✨
