const ticketList = document.getElementById('tickets');
const newTicketBtn = document.getElementById('new-ticket-btn');

// Fetch tickets on page load
fetch('/node/ben/getTickets')
.then(response => response.json())
.then(tickets => {
    tickets.forEach(ticket => {
        const ticketItem = document.createElement('div');
        ticketItem.classList.add('ticket');
        ticketItem.innerHTML = `
            <a href="viewTicket.html?ticketID=${ticket.ticketID}">
                #${ticket.ticketID} - ${ticket.username} - ${ticket.description} - ${ticket.status}
            </a>
        `;
        ticketList.appendChild(ticketItem);
    });
});

// Handle new ticket button click
newTicketBtn.addEventListener('click', () => {
    window.location.href = "/newTicket.html";
});
