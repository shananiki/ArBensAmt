// Test file to log itemIDs using osrs ge

console.log(new Date().toISOString());
const https = require('https');
const itemId = 962; // Example item ID
var price = 0;
const sqlite3 = require('sqlite3').verbose();

function fetchItemDetails(itemId) {
    const apiUrl = `https://secure.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=${itemId}`;

    return new Promise((resolve, reject) => {
        https.get(apiUrl, response => {
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', error => {
            reject(error);
        });
    });
}



// Function to add an entry to the item_price table
function addItemPrice(db, itemID, price, timestamp) {
    return new Promise((resolve, reject) => {
        // Prepare the SQL statement
        const stmt = db.prepare("INSERT INTO item_price (itemID, price, timestamp) VALUES (?, ?, ?)");

        // Execute the prepared statement with the provided parameters
        stmt.run(itemID, price, timestamp, function(err) {
            // Check for errors
            if (err) {
                reject(err.message);
            } else {
                // Resolve with the last inserted row ID
                resolve(this.lastID);
            }
        });

        // Finalize the statement
        stmt.finalize();
    });
}

const db = new sqlite3.Database('items.db');
const timestamp = new Date().toISOString(); // Use the current timestamp

async function main(){
    
await fetchItemDetails(itemId)
    .then(itemDetails => {
        price = itemDetails.item.current.price;
    })
    .catch(error => {
        console.error('Error fetching item details:', error);
    });
    
addItemPrice(db, itemId, price, timestamp)
    .then(lastID => {
        console.log(`Entry added with ID: ${lastID}`);
    })
    .catch(error => {
        console.error('Error adding entry:', error);
    })
    .finally(() => {
        db.close();
    });

}

main();