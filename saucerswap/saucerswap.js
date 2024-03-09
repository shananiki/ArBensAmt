window.onload = function() {
    fetch('https://api.saucerswap.finance/tokens/0.0.731861')
    .then(response => response.json())
    .then(data => {
        
        const icon = 'https://www.saucerswap.finance/' + data.icon;
        const name = data.name;
        const id = data.id;
        
        const nameLabel = document.createElement('h1');
        nameLabel.textContent = name;
        document.body.appendChild(nameLabel);

        const idLabel = document.createElement('h2');
        idLabel.textContent = `ID: ${id}`;
        document.body.appendChild(idLabel);

        const iconDiv = document.createElement('div');
        iconDiv.innerHTML = `<img src="${icon}" alt="${name} icon" width="128" height="128">`;
        document.body.appendChild(iconDiv);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
};
