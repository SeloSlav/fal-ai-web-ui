import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { imageName } = req.query; // Image name from the query params
  const filePath = path.join(process.cwd(), 'outputs', imageName);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(data);
  });
}
