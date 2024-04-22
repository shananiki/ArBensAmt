document.addEventListener('DOMContentLoaded', function() {
const tradesTable = document.getElementById('trades-data');

fetch('/api/trades')
  .then(response => response.json())
  .then(data => {
    data.forEach(trade => {
      const tableRow = document.createElement('tr');
      const coinCell = document.createElement('td');
      const buySellCell = document.createElement('td');
      const amountCell = document.createElement('td');
      const dateCell = document.createElement('td');

      // Replace with logic to get coin name based on coin_id (e.g., fetch coin data)
      fetch('/api/coins/' + trade.coin_id)
                    .then(response => response.json())
                    .then(responsedata => {
                        console.log(responsedata);
                        coinCell.textContent = responsedata.name;
                    });

      buySellCell.textContent = trade.buy_sell;
      amountCell.textContent = trade.amount;

      tableRow.appendChild(coinCell);
      tableRow.appendChild(buySellCell);
      tableRow.appendChild(amountCell);

      tradesTable.appendChild(tableRow);
    });
  })
  .catch(error => console.error(error));


    const newTradeBtn = document.getElementById('new-trade-btn');
    const newTradeForm = document.getElementById('new-trade-form');
    const addTradeForm = document.getElementById('add-trade-form');
    const coinSelect = document.getElementById('coinId');

    // Function to fetch and populate coin options
    function fetchCoins() {
        fetch('/api/coins')
            .then(response => response.json())
            .then(data => {
                data.forEach(coin => {
                    const option = document.createElement('option');
                    option.value = coin.id;
                    
                    option.textContent = coin.name;
                    coinSelect.appendChild(option);
                });
            })
            .catch(error => console.error(error));
    }

    // Populate coin options on page load
    fetchCoins();

    newTradeBtn.addEventListener('click', () => {
        newTradeForm.style.display = newTradeForm.style.display === 'none' ? 'block' : 'none';
    });

    addTradeForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const coinId = document.getElementById('coinId').value;
        const buySell = document.getElementById('buySell').value;
        const amount = document.getElementById('amount').value;

        // Send a POST request to /api/trades with form data
        fetch('/api/trades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    coinId,
                    buySell,
                    amount
                })
            })
            .then(response => response.json())
            .then(data => {
                // Handle successful addition (e.g., display success message)
                console.log('Trade added:', data);
                // Clear the form and potentially refetch trade data
            })
            .catch(error => console.error(error));
    });
});