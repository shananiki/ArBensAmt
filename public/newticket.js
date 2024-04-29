const newTicketForm = document.getElementById('new-ticket-form');
const messageEl = document.getElementById('message');
const backToTicketsBtn = document.getElementById('back-to-tickets');


newTicketForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const description = document.getElementById('description').value;

  const data = {
    creatorName: username,
    description: description,
  };

  fetch('/node/ben/newTicket', { // Replace with your actual endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      messageEl.textContent = `Error: ${data.error}`;
    } else {
      messageEl.textContent = 'Ticket wurde an das ArBensAmt übertragen!';
      // Optionally clear the form after successful submission
      newTicketForm.reset();
    }
  })
  .catch(error => {
    console.error('Error submitting ticket:', error);
    messageEl.textContent = 'Etwas ist schiefgelaufen...';
  });
});


backToTicketsBtn.addEventListener('click', () => {
  // Redirect to "/tickets" on click
  window.location.href = "/tickets.html";
});
