const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function encryptText(text, key) {
    return crypto.AES.encrypt(text, key).toString();
}

function decryptText(encryptedText, key) {
    const bytes = crypto.AES.decrypt(encryptedText, key);
    return bytes.toString(crypto.enc.Utf8);
}

function readHTMLFile(filePath, callback) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
        } else {
            callback(null, html);
        }
    });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'note.html'));
});

app.post('/create', (req, res) => {
    const note = req.body.note;
    const key = generateRandomString(8);
    //const encryptedNote = encryptText(note, key);
    const fileName = key + '.txt';

    //fs.writeFileSync(path.join(__dirname, 'notes', fileName), encryptedNote);
    fs.writeFileSync(path.join(__dirname, 'notes', fileName), note);
    res.send(key);
});

app.get('/:encryptionkey', (req, res) => {
    const encryptionKey = req.params.encryptionkey;
    const filePath = path.join(__dirname, 'notes', `${encryptionKey}.txt`);

    const viewNoteHTML = path.join(__dirname, 'public', `view.html`);
  
    if (fs.existsSync(filePath)) {
        const encryptedText = fs.readFileSync(filePath, 'utf8').trim();
        //var decryptedText = decryptText(encryptedText, encryptionKey);

        readHTMLFile(viewNoteHTML, (err, html) => {
        if (err) {
            res.status(500).send("Internal Server Error");
            return;
        }

        const filledHTML = html.replace('{{decryptedText}}', encryptedText);

        res.send(filledHTML);
        });
    }else{
        res.send("Note doesn't exist");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function generateRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }
    return result;
}
