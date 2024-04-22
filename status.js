const ticketStatus = new Map([
    [ 1 , 'Neu'],
    [ 2, 'In Bearbeitung'],
    [ 3 , 'Fertig'],
]);

console.log(ticketStatus.get(1));