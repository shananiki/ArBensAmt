require ('dotenv').config();

var token = process.env.token;
console.log(token);

const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] 
});

client.on('message', message => {
    console.log(message);
    // Your message handling code goes here
});

// Log in to Discord with your client's token
client.login(token);