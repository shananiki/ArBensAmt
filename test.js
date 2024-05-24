const mysql = require('mysql2/promise');

// Replace with your remote MariaDB server details
const connectionConfig = {
  host: '93.199.63.90',
  user: 'root',
  password: 'Regenbogen1!',
  database: 'amt'
};

(async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    // Query the users table
    const [rows] = await connection.execute('SELECT * FROM users');

    // Print each user row
    rows.forEach(row => {
      console.log(row);
    });

    connection.end();
  } catch (error) {
    console.error('Error connecting to MariaDB:', error);
  }
})();
