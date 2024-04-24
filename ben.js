require('dotenv').config()
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const fs = require('fs');
const path = require('path'); 

const ticketStatus = require('./status');

const app = express();
const port = 3000;

const db_file = process.env.DATABASE_FILE;
const BASE_URL = process.env.BASE_URL;

const db = new sqlite3.Database(db_file);

// App use
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


app.get('/node/', (req, res) => {
    res.send('Node is working! Version 0.1.20a');
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tickets', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tickets.html'));
});

// Route to create a new ticket (sends dummy data for now)
app.get('/newTicket', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newTicket.html'));
});

// Get all tickets
app.get('/node/ben/getTickets', (req, res) => {
    db.all('SELECT * FROM tickets', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Add a new ticket
app.post('/node/ben/newTicket', (req, res) => {
    console.log("Received JSON: " + req.body);
    //const ticketID = req.body.number;
    const name = req.body.creatorName;
    const description = req.body.description;
    //const status = req.body.status;
    
    const sql = 'INSERT INTO tickets (username, description, status) VALUES (?, ?, ?)';
    db.run(sql, [name, description, 0], (err) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        res.json({
            message: 'Ticket wurde erstellt.'
        });
    });
});

// Edit a ticket
app.post('/node/ben/editTicket', (req, res) => {
    const ticketID = req.body.number;
    const name = req.body.creatorName;
    const description = req.body.description;
    const status = req.body.status;
  
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
