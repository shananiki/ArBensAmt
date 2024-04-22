document.addEventListener('DOMContentLoaded', function() {
  const coinsTable = document.getElementById('coins-data');

  fetch('/api/coins')
      .then(response => response.json())
      .then(data => {
          data.forEach(coin => {
              const tableRow = document.createElement('tr');
              const nameCell = document.createElement('td');
              const tickerCell = document.createElement('td');
              const tokenIdCell = document.createElement('td');

              nameCell.textContent = coin.name;
              tickerCell.textContent = coin.ticker;
              tokenIdCell.textContent = coin.tokenID;

              tableRow.appendChild(nameCell);
              tableRow.appendChild(tickerCell);
              tableRow.appendChild(tokenIdCell);

              coinsTable.appendChild(tableRow);
          });
      })
      .catch(error => console.error(error));

      
      const newTokenBtn = document.getElementById('new-token-btn');
      const newTokenForm = document.getElementById('new-token-form');
      const addCoinForm = document.getElementById('add-coin-form');
    
      newTokenBtn.addEventListener('click', () => {
          newTokenForm.style.display = newTokenForm.style.display === 'none' ? 'block' : 'none';
      });
    
      addCoinForm.addEventListener('submit', (event) => {
          event.preventDefault(); // Prevent default form submission
    
          const name = document.getElementById('name').value;
          const ticker = document.getElementById('ticker').value;
          const tokenID = document.getElementById('tokenID').value;
    
          // Send a POST request to /api/coins with form data
          fetch('/api/coins', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      name,
                      ticker,
                      tokenID
                  })
              });
      });
});
