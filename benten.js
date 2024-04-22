const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const fs = require('fs');
const path = require('path'); 

const app = express();
const port = 3000;



app.use(express.static(path.join(__dirname, 'public')));
app.use('/portfolio', express.static(path.join(__dirname, 'portfolio')));
app.use('/trades', express.static(path.join(__dirname, 'trades')));
app.use(express.json());

const db = new sqlite3.Database('./crypto_tracker.db');

// HTML endpoints
app.get('/portfolio/', (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio', 'portfolio.html'));
});

app.get('/trades/', (req, res) => {
    res.sendFile(path.join(__dirname, 'trades', 'trades.html'));
});

// API calls für die DB

// Get all coins
app.get('/api/coins', (req, res) => {
    db.all('SELECT * FROM coins', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get all trades
app.get('/api/trades', (req, res) => {
    db.all('SELECT * FROM trades', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get a specific coin by ID
app.get('/api/coins/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM coins WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});
// Add a new coin
app.post('/api/coins', (req, res) => {
    const name = req.body.name;
    const ticker = req.body.ticker;
    const tokenID = req.body.tokenID;
  
    const sql = 'INSERT INTO coins (name, ticker, tokenID) VALUES (?, ?, ?)';
    db.run(sql, [name, ticker, tokenID], (err) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        res.json({
            message: 'Coin added successfully'
        });
    });
});

// Add a new trade 
app.post('/api/trades', (req, res) => {
    const { coinId, buySell, amount } = req.body;
  
    const sql = 'INSERT INTO trades (coin_id, buy_sell, amount) VALUES (?, ?, ?)';
    db.run(sql, [coinId, buySell, amount], (err) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        res.json({
            message: 'Trade added successfully'
        });
    });
});

// Delete a coin (implementation goes here)
app.delete('/api/coins/:id', (req, res) => {
    const id = req.params.id;
    // Implement logic to delete coin from database
});

// Get all trades (implementation goes here)
app.get('/api/trades', (req, res) => {
    // Implement logic to get all trades from database
});

// Get trades for a specific coin (implementation goes here)
app.get('/api/trades/:coinId', (req, res) => {
    const coinId = req.params.id;
    // Implement logic to get trades for specific coin
});

// Add a new trade (implementation goes here)
app.post('/api/trades', (req, res) => {
    const { coinId, buySell, amount } = req.body;
    // Implement logic to add new trade to database
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

