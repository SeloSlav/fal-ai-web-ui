// pages/api/getGeneratedImages.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const outputDir = path.join(process.cwd(), 'public', 'outputs');
  
  try {
    const files = fs.readdirSync(outputDir);
    const images = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file)); // Only images
    res.status(200).json({ images });
  } catch (error) {
    console.error('Error reading outputs directory:', error);
    res.status(500).json({ message: 'Failed to load images' });
  }
}
