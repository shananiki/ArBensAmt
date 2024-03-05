const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');
const app = express();

app.use(express.json());

// Set to store hashed combinations
const visitedSet = new Set();

// Function to hash a combination of IP address and useragent
function hashCombination(ipAddress, userAgent) {
    const combination = ipAddress + userAgent;
    return crypto.createHash('sha512').update(combination).digest('hex');
}

// Read visits.txt file and populate visitedSet
const rl = readline.createInterface({
    input: fs.createReadStream('visits.txt'),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    visitedSet.add(line);
});

rl.on('close', () => {
    console.log('Visited set loaded from file');
    startServer();
});

// Check if visitor is unique
app.get('/visit', (req, res) => {
    const ipAddress = req.ip; 
    const userAgent = req.get('User-Agent'); 
    // Hash Hash ip + useragent cuz we aint NSA
    const hashedCombination = hashCombination(ipAddress, userAgent);

    // check dupes
    if (visitedSet.has(hashedCombination)) {
        console.log('Combination already visited');
        return res.send('Combination already visited');
    }

    // update the set
    visitedSet.add(hashedCombination);

    // update the log
    fs.appendFile('visits.txt', hashedCombination + `\n`, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Error');
        }
        console.log('Unique visitor logged.');
        res.send('Visit recorded successfully');
    });
});

app.get('/visitorCount', (req, res) => {
    fs.readFile('visits.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        const lines = data.trim().split('\n');
        var visitorCount = lines.length;
        if(lines[0].trim() === ""){
            visitorCount--;
        }
        // Count of visitors back
        res.send(`${visitorCount}`);
    });
});

function startServer() {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
