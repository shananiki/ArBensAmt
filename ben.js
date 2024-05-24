require('dotenv').config()
const mysql = require('mysql2/promise');
const express = require('express');
const fs = require('fs');
const path = require('path'); 


const app = express();

const db_file = process.env.DATABASE_FILE;
const BASE_URL = process.env.BASE_URL;
const port = process.env.PORT;

// DB Stuff
var DB_HOST = process.env.DB_HOST;
var DB_PASSWORD = process.env.DB_PASSWORD;
var DB_DATABASE = process.env.DB_DATABASE;
var DB_USER = process.env.DB_USER;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE
});


app.use(express.json());
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

app.get('/viewTicket.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'viewTicket.html'));
});


// Get specific ticket
app.get('/node/ben/getTicket/:ticketID', async (req, res) => {
  const ticketID = req.params.ticketID;
  const connection = await pool.getConnection();

  const sql = `SELECT * FROM tickets where ticketID = ?`;
  const [rows] = await connection.execute(sql, [ticketID]); 

  connection.release();

  if (rows.length === 0) {
    return res.status(404).send('No tickets found');
  }
  console.log(rows);
  res.json(rows[0]);
});

// Get all tickets
app.get('/node/ben/getTickets', async (req, res) => {

  const connection = await pool.getConnection();

  const sql = `SELECT * FROM tickets`;
  const [rows] = await connection.execute(sql); 

  connection.release();

  if (rows.length === 0) {
    return res.status(404).send('No tickets found');
  }

  res.json(rows);
});

// Add a new ticket
app.post('/node/ben/newTicket', async (req, res) => {
    console.log("Received JSON: " + req.body);
    //const ticketID = req.body.number;
    const name = req.body.creatorName;
    const description = req.body.description;
    //const status = req.body.status;
    
    try {

      const connection = await pool.getConnection();
      const sql = `INSERT INTO tickets (username, description, status) VALUES (?, ?, ?)`;
      const [rows] = await connection.execute(sql, [name, description, 0]); 
      connection.release();
      
      res.status(200).send('Ticket successfully created!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
});

// Edit a ticket
app.post('/node/ben/editTicket', (req, res) => {
    const ticketID = req.body.number;
    const name = req.body.creatorName;
    const description = req.body.description;
    const status = req.body.status;
  
});

app.listen(port, () => console.log(`Server listening on port ${port}`));