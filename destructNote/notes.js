const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto-js');
const Buffer = require('buffer').Buffer;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function toB64(text){
    return Buffer.from(text).toString('base64');
}

function fromB64(text){
    return Buffer.from(text, 'base64').toString('utf-8');
}

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
    console.log(note);
    //const encryptedNote = encryptText(note, key);
    const fileName = key + '.txt';
    //note = toB64(note.toString());
    //fs.writeFileSync(path.join(__dirname, 'notes', fileName), encryptedNote);
    fs.writeFileSync(path.join(__dirname, 'notes', fileName), note);
    res.send(key);
});

app.get('/get/:noteKey', (req, res) => {
    const noteKey = req.params.noteKey;
    const filePath = path.join(__dirname, 'notes', `${noteKey}.txt`);
    console.log(noteKey);
    if (fs.existsSync(filePath)) {
        const encryptedText = fs.readFileSync(filePath, 'utf8').trim();
        
        res.send(encryptedText);
        
    }else{
        res.send("Note doesn't exist");
    }
});

app.get('/note/:noteKey', (req, res) => {
    const noteKey = req.params.noteKey;
    const filePath = path.join(__dirname, 'notes', `${noteKey}.txt`);

    const viewNoteHTML = path.join(__dirname, 'public', `viewnote.html`);
  
   
    res.sendFile(path.join(__dirname, 'public', 'viewnote.html'));
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
