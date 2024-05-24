const newTicketForm = document.getElementById('new-ticket-form');
const messageEl = document.getElementById('message');
const backToTicketsBtn = document.getElementById('back-to-tickets');


newTicketForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const creatorName = document.getElementById('username').value;
  const description = document.getElementById('description').value;

  const data = {
      creatorName: creatorName,
      description: description
  };

  try {
      const response = await fetch('/node/ben/newTicket', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (response.status === 200) {
          alert("Ticket wurde an Ben übertragen!");
          messageEl.textContent = 'Ticket wurde an das ArBensAmt übertragen!';
      } else {
        alert("Es gab einen kleinen Fehler...");
        messageEl.textContent = 'Error!';
      }
  } catch (error) {
      console.error('Error:', error);
  }
});


backToTicketsBtn.addEventListener('click', () => {
  // Redirect to "/tickets" on click
  window.location.href = "/tickets.html";
});
