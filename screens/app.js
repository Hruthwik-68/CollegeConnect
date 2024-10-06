const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dbms',
  database: 'collegeconnect',
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Multer Configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes

// Upload Photo Endpoint
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  const photoUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

  // Optionally, you can save filePath in database for local storage
  // Remove file from uploads folder after saving to database
  fs.unlinkSync(filePath);

  res.status(200).json({ imageUrl: photoUrl });
});

// Create Event Endpoint
app.post('/api/events', (req, res) => {
  const { eventName, collegeName, description, photoUrl } = req.body;

  if (!eventName || !collegeName || !description) {
    return res.status(400).json({ message: 'Event details incomplete' });
  }

  const insertQuery = 'INSERT INTO events (eventName, collegeName, description, photoUrl) VALUES (?, ?, ?, ?)';
  const values = [eventName, collegeName, description, photoUrl];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error inserting event:', err);
      return res.status(500).json({ message: 'Error creating event' });
    }

    res.status(201).json({ message: 'Event created successfully' });
  });
});

// Serve static files (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
