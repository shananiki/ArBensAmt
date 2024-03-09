const BASE_URL = "https://secure.runescape.com/m=itemdb_oldschool";
const ITEM_ENDPOINT = "/api/catalogue/detail.json?item=";
const CHRISTMAS_CRACKER = "892";

window.onload = function() {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36';

    var newURL = BASE_URL+ITEM_ENDPOINT+CHRISTMAS_CRACKER;
    fetch(newURL,
        {
            headers: {
                'User-Agent': userAgent
              }
        })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
};
