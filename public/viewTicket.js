document.addEventListener('DOMContentLoaded', () => {
    const ticketDetails = document.getElementById('ticketDetails');
    const urlParams = new URLSearchParams(window.location.search);
    const ticketID = urlParams.get('ticketID');

    if (ticketID) {
        fetch(`/node/ben/getTicket/${ticketID}`)
        .then(response => response.json())
        .then(ticket => {
            ticketDetails.innerHTML = `
                <h1>Ticket #${ticket.ticketID}</h1>
                <p><strong>Username:</strong> ${ticket.username}</p>
                <p><strong>Description:</strong> ${ticket.description}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
            `;
        })
        .catch(error => {
            ticketDetails.innerHTML = `<p>Error fetching ticket details: ${error}</p>`;
        });
    } else {
        ticketDetails.innerHTML = `<p>No ticket ID provided.</p>`;
    }
});
