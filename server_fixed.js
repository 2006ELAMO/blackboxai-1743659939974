const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
// Serve static files with proper caching headers
// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    } else if (path.endsWith('.html')) {
      res.set('Content-Type', 'text/html');
    }
  }
}));

// Explicit routes for main files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

app.get('/test.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.js'));
});

// Prevent favicon 404
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/minimal', (req, res) => {
  res.sendFile(path.join(__dirname, 'minimal_test_final.html'));
});

// File conversion endpoint
app.post('/convert', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!req.file.originalname.toLowerCase().endsWith('.bf')) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Invalid file type' });
        }

        const fileData = fs.readFileSync(req.file.path);
        const convertedData = Buffer.from(fileData);
        
        // Mock conversion
        convertedData[0] = 0x50; // PS3 identifier
        convertedData[1] = 0x53;
        convertedData[2] = 0x33;

        fs.unlinkSync(req.file.path);

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=converted_ps3.bf');
        res.send(convertedData);
    } catch (err) {
        console.error('Conversion error:', err);
        res.status(500).json({ error: 'Conversion failed' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});