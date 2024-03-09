const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

app.get('/item/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const response = await fetch(`https://secure.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=${itemId}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
