import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'], // Allow all potential frontend ports
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static file serving for uploaded models with proper headers
app.use('/uploads', (req, res, next) => {
  // Set proper headers for GLB/GLTF files
  const ext = path.extname(req.url).toLowerCase();
  if (ext === '.glb') {
    res.setHeader('Content-Type', 'model/gltf-binary');
  } else if (ext === '.gltf') {
    res.setHeader('Content-Type', 'model/gltf+json');
  }
  
  // Allow cross-origin access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  console.log(`Serving file: ${req.url}`); // Debug log
  next();
}, express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(glb|gltf)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only GLB and GLTF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Separate multer configuration for voice files
const voiceUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow audio files for voice recordings
    const allowedTypes = /\.(wav|mp3|m4a|webm|ogg)$/i;
    if (allowedTypes.test(file.originalname) || file.fieldname === 'audioFile') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed for voice recordings'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for audio files
  }
});

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'dolls.db'));

// Create tables
db.serialize(() => {
  // Dolls table
  db.run(`
    CREATE TABLE IF NOT EXISTS dolls (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      story TEXT,
      brand TEXT,
      purchase_location TEXT,
      email TEXT,
      model_filename TEXT NOT NULL,
      model_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Stickers table
  db.run(`
    CREATE TABLE IF NOT EXISTS stickers (
      id TEXT PRIMARY KEY,
      doll_id TEXT,
      type TEXT NOT NULL,
      position_x REAL NOT NULL,
      position_y REAL NOT NULL,
      position_z REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doll_id) REFERENCES dolls (id) ON DELETE CASCADE
    )
  `);

  // Voice profiles table
  db.run(`
    CREATE TABLE IF NOT EXISTS voice_profiles (
      id TEXT PRIMARY KEY,
      doll_id TEXT UNIQUE,
      audio_filename TEXT,
      personality_traits TEXT,
      api_key TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doll_id) REFERENCES dolls (id) ON DELETE CASCADE
    )
  `);
});

// API Routes

// Upload doll with 3D model
app.post('/api/dolls', upload.single('modelFile'), (req, res) => {
  try {
    const { name, story, brand, purchaseLocation, email } = req.body;
    
    if (!req.file || !name) {
      return res.status(400).json({ 
        error: 'Model file and doll name are required' 
      });
    }

    const dollId = uuidv4();
    const modelUrl = `/uploads/${req.file.filename}`;

    db.run(
      `INSERT INTO dolls (id, name, story, brand, purchase_location, email, model_filename, model_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [dollId, name, story || '', brand || '', purchaseLocation || '', email || '', req.file.filename, modelUrl],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save doll data' });
        }

        res.json({
          id: dollId,
          name,
          story: story || '',
          brand: brand || '',
          purchaseLocation: purchaseLocation || '',
          email: email || '',
          modelUrl: `http://localhost:${PORT}${modelUrl}`,
          stickers: []
        });
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all dolls
app.get('/api/dolls', (req, res) => {
  db.all(
    `SELECT d.*, 
     GROUP_CONCAT(
       json_object(
         'id', s.id,
         'type', s.type,
         'position', json_array(s.position_x, s.position_y, s.position_z)
       )
     ) as stickers
     FROM dolls d 
     LEFT JOIN stickers s ON d.id = s.doll_id 
     GROUP BY d.id 
     ORDER BY d.created_at DESC`,
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch dolls' });
      }

      const dolls = rows.map(row => ({
        id: row.id,
        name: row.name,
        story: row.story,
        brand: row.brand,
        purchaseLocation: row.purchase_location,
        email: row.email,
        modelUrl: `http://localhost:${PORT}${row.model_url}`,
        stickers: row.stickers ? JSON.parse(`[${row.stickers}]`) : [],
        createdAt: row.created_at
      }));

      res.json(dolls);
    }
  );
});

// Get single doll by ID
app.get('/api/dolls/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM dolls WHERE id = ?',
    [id],
    (err, doll) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch doll' });
      }

      if (!doll) {
        return res.status(404).json({ error: 'Doll not found' });
      }

      // Get stickers for this doll
      db.all(
        'SELECT * FROM stickers WHERE doll_id = ?',
        [id],
        (err, stickers) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch stickers' });
          }

          // Get voice profile for this doll
          db.get(
            'SELECT * FROM voice_profiles WHERE doll_id = ?',
            [id],
            (err, voiceProfile) => {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to fetch voice profile' });
              }

              const dollData = {
                id: doll.id,
                name: doll.name,
                story: doll.story,
                brand: doll.brand,
                purchaseLocation: doll.purchase_location,
                email: doll.email,
                modelUrl: `http://localhost:${PORT}${doll.model_url}`,
                stickers: stickers.map(s => ({
                  id: s.id,
                  type: s.type,
                  position: [s.position_x, s.position_y, s.position_z]
                })),
                voiceProfile: voiceProfile ? {
                  personalityTraits: JSON.parse(voiceProfile.personality_traits || '[]'),
                  apiKey: voiceProfile.api_key
                } : null
              };

              res.json(dollData);
            }
          );
        }
      );
    }
  );
});

// Add sticker to doll
app.post('/api/dolls/:id/stickers', (req, res) => {
  const { id } = req.params;
  const { type, position } = req.body;

  if (!type || !position || position.length !== 3) {
    return res.status(400).json({ error: 'Type and position [x, y, z] are required' });
  }

  const stickerId = uuidv4();

  db.run(
    'INSERT INTO stickers (id, doll_id, type, position_x, position_y, position_z) VALUES (?, ?, ?, ?, ?, ?)',
    [stickerId, id, type, position[0], position[1], position[2]],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to add sticker' });
      }

      res.json({
        id: stickerId,
        type,
        position
      });
    }
  );
});

// Remove sticker
app.delete('/api/dolls/:dollId/stickers/:stickerId', (req, res) => {
  const { stickerId } = req.params;

  db.run(
    'DELETE FROM stickers WHERE id = ?',
    [stickerId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to remove sticker' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Sticker not found' });
      }

      res.json({ message: 'Sticker removed successfully' });
    }
  );
});

// Save voice profile
app.post('/api/dolls/:id/voice', voiceUpload.single('audioFile'), (req, res) => {
  const { id } = req.params;
  const { personalityTraits, apiKey } = req.body;

  console.log('Saving voice profile for doll:', id);
  console.log('Personality traits:', personalityTraits);
  console.log('Audio file:', req.file ? req.file.filename : 'none');

  const audioFilename = req.file ? req.file.filename : null;
  
  // Parse personality traits if it's a string
  let parsedTraits = personalityTraits;
  if (typeof personalityTraits === 'string') {
    try {
      parsedTraits = JSON.parse(personalityTraits);
    } catch (error) {
      console.error('Error parsing personality traits:', error);
      parsedTraits = [];
    }
  }

  db.run(
    `INSERT OR REPLACE INTO voice_profiles (id, doll_id, audio_filename, personality_traits, api_key) 
     VALUES (?, ?, ?, ?, ?)`,
    [uuidv4(), id, audioFilename, JSON.stringify(parsedTraits || []), apiKey || ''],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save voice profile' });
      }

      console.log('Voice profile saved successfully for doll:', id);
      res.json({ message: 'Voice profile saved successfully' });
    }
  );
});

// Delete doll
app.delete('/api/dolls/:id', (req, res) => {
  const { id } = req.params;

  // First get the doll to find the model file
  db.get('SELECT model_filename FROM dolls WHERE id = ?', [id], (err, doll) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch doll' });
    }

    if (!doll) {
      return res.status(404).json({ error: 'Doll not found' });
    }

    // Delete the doll from database (this will cascade delete stickers and voice profiles)
    db.run('DELETE FROM dolls WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete doll' });
      }

      // Try to delete the associated file
      if (doll.model_filename) {
        const filePath = path.join(uploadsDir, doll.model_filename);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log('Warning: Could not delete model file:', err.message);
          } else {
            console.log('Deleted model file:', doll.model_filename);
          }
        });
      }

      res.json({ message: 'Doll deleted successfully' });
    });
  });
});

// Download and store video locally
app.post('/api/download-video', async (req, res) => {
  const { videoUrl, filename, dollId } = req.body;
  
  try {
    console.log('Downloading video:', videoUrl);
    
    // Create videos directory if it doesn't exist
    const videosDir = path.join(uploadsDir, 'videos');
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }
    
    // Download video from URL
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const videoPath = path.join(videosDir, filename);
    
    // Save video file
    fs.writeFileSync(videoPath, Buffer.from(buffer));
    
    console.log('Video saved locally:', videoPath);
    
    res.json({ 
      message: 'Video downloaded successfully',
      filename,
      path: `/uploads/videos/${filename}`
    });
    
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
});

// Brand API Routes

// Get brand analytics
app.get('/api/brands/:brandId/analytics', (req, res) => {
  const { brandId } = req.params;
  
  // Mock analytics data - in a real app, this would query actual data
  const analytics = {
    totalRevenue: 126420,
    totalCustomers: 342,
    averageOrderValue: 54.50,
    customerRetention: 78,
    conversionRate: 12.3,
    engagementRate: 87,
    revenueData: [
      { month: 'Jan', revenue: 14700, orders: 42 },
      { month: 'Feb', revenue: 17850, orders: 51 },
      { month: 'Mar', revenue: 15980, orders: 47 },
      { month: 'Apr', revenue: 20670, orders: 63 },
      { month: 'May', revenue: 23320, orders: 71 },
      { month: 'Jun', revenue: 25200, orders: 78 }
    ],
    topProducts: [],
    customerSegments: []
  };
  
  res.json(analytics);
});

// Get brand campaigns
app.get('/api/brands/:brandId/campaigns', (req, res) => {
  const { brandId } = req.params;
  
  // Mock campaign data
  const campaigns = [
    {
      id: '1',
      name: 'Holiday Collection Launch',
      type: 'email',
      status: 'active',
      audience: 'Premium Customers',
      sent: 342,
      opened: 289,
      clicked: 156,
      converted: 42,
      createdDate: '2025-06-20',
      scheduledDate: '2025-06-25'
    },
    {
      id: '2',
      name: 'Loyalty Reward Program',
      type: 'reward',
      status: 'completed',
      audience: 'All Customers',
      sent: 521,
      opened: 487,
      clicked: 312,
      converted: 89,
      createdDate: '2025-06-15'
    }
  ];
  
  res.json(campaigns);
});

// Create new campaign
app.post('/api/brands/:brandId/campaigns', (req, res) => {
  const { brandId } = req.params;
  const { name, type, audience, subject, content, scheduledDate } = req.body;
  
  const campaignId = uuidv4();
  const campaign = {
    id: campaignId,
    name,
    type,
    status: scheduledDate ? 'scheduled' : 'draft',
    audience,
    subject,
    content,
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    createdDate: new Date().toISOString().split('T')[0],
    scheduledDate
  };
  
  // In a real app, save to database
  console.log('Created campaign:', campaign);
  
  res.status(201).json(campaign);
});

// Get brand customers
app.get('/api/brands/:brandId/customers', (req, res) => {
  const { brandId } = req.params;
  
  // Mock customer data
  const customers = [
    {
      id: '1',
      name: 'Emma Chen',
      email: 'emma.chen@email.com',
      joinDate: '2024-03-15',
      dollsOwned: 3,
      engagement: 95,
      lastActive: '2025-06-24',
      tier: 'Gold',
      totalSpent: 215.75
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      joinDate: '2024-05-20',
      dollsOwned: 5,
      engagement: 88,
      lastActive: '2025-06-25',
      tier: 'Platinum',
      totalSpent: 358.20
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      email: 'maria.r@email.com',
      joinDate: '2024-01-10',
      dollsOwned: 2,
      engagement: 72,
      lastActive: '2025-06-23',
      tier: 'Silver',
      totalSpent: 108.75
    }
  ];
  
  res.json(customers);
});

// Get brand profile
app.get('/api/brands/:brandId/profile', (req, res) => {
  const { brandId } = req.params;
  
  // Mock brand profile data
  const profile = {
    id: brandId,
    name: "PopMart Studio",
    logo: "🎨",
    description: "Leading designer toy brand creating collectible characters that bring joy and imagination to collectors worldwide.",
    website: "https://popmart.com",
    founded: "2010",
    headquarters: "Beijing, China",
    specialty: "Designer Toys & Collectibles",
    customerBase: 12450,
    dollsLaunched: 45,
    rating: 4.9,
    verified: true,
    tier: 'Premium'
  };
  
  res.json(profile);
});

// Update brand profile
app.put('/api/brands/:brandId/profile', (req, res) => {
  const { brandId } = req.params;
  const updates = req.body;
  
  // In a real app, update the database
  console.log('Updating brand profile:', brandId, updates);
  
  res.json({ message: 'Profile updated successfully', updates });
});

// Get brand partnerships
app.get('/api/brands/:brandId/partnerships', (req, res) => {
  const { brandId } = req.params;
  
  // Mock partnership data
  const partnerships = [
    {
      id: '1',
      name: 'Global Retail Expansion',
      type: 'retail',
      status: 'active',
      startDate: '2024-03-01',
      value: 2500000,
      description: 'Partnership with major retail chains for global distribution'
    },
    {
      id: '2',
      name: 'Artist Collaboration Series',
      type: 'collaboration',
      status: 'pending',
      startDate: '2024-07-01',
      value: 500000,
      description: 'Limited edition series with renowned digital artists'
    }
  ];
  
  res.json(partnerships);
});

// Get all featured brands for showcase
app.get('/api/brands/featured', (req, res) => {
  const featuredBrands = [
    {
      id: '1',
      name: "PopMart Studio",
      logo: "🎨",
      specialty: "Designer Toys",
      rating: 4.9,
      customers: "12.4K",
      verified: true,
      tier: "Premium",
      dolls: 45,
      description: "Leading creator of collectible art toys and designer figures"
    },
    {
      id: '2',
      name: "Sanrio Collection",
      logo: "🌸",
      specialty: "Character Goods",
      rating: 4.8,
      customers: "8.7K",
      verified: true,
      tier: "Premium",
      dolls: 32,
      description: "Beloved characters bringing joy and kawaii culture worldwide"
    },
    {
      id: '3',
      name: "Build-A-Bear Workshop",
      logo: "🧸",
      specialty: "Customizable Bears",
      rating: 4.7,
      customers: "15.2K",
      verified: true,
      tier: "Premium",
      dolls: 28,
      description: "Create your own personalized furry friend with endless possibilities"
    }
  ];
  
  res.json(featuredBrands);
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
