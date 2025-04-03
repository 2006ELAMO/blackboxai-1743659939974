const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public'));

// Endpoint for file conversion
app.post('/convert', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Validate file extension
        if (!req.file.originalname.toLowerCase().endsWith('.bf')) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Invalid file type' });
        }

        // Read the uploaded file
        const fileData = fs.readFileSync(req.file.path);

        // Convert the file (placeholder logic)
        // In a real implementation, this would involve:
        // 1. Parsing Wii .bf format
        // 2. Converting to PS3 .bf format
        // 3. Handling endianness differences
        const convertedData = Buffer.from(fileData);
        
        // Mock some changes to simulate conversion
        convertedData[0] = 0x50; // PS3 identifier
        convertedData[1] = 0x53;
        convertedData[2] = 0x33;

        // Clean up
        fs.unlinkSync(req.file.path);

        // Send converted file
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