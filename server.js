const express = require('express');
const path = require('path'); // for serving static files

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for "/"
app.get('/node/', (req, res) => {
  res.send('Node is working!');
});

// Route for "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
