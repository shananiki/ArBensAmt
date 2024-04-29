package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath" // Import the filepath package
        _ "github.com/mattn/go-sqlite3"
)

type Ticket struct {
	TicketID  int    `json:"ticketID"`
	Username  string `json:"username"`
	Description string `json:"description"`
	Status    int    `json:"status"`
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	// Define the root directory for static files
	staticRoot := http.Dir("public")

	// Serve the requested file from the static directory
	http.ServeFile(w, r, filepath.Join(string(staticRoot), r.URL.Path))
}

func getTickets(w http.ResponseWriter, r *http.Request) {
	// Open the database connection
	db, err := sql.Open("sqlite3", "das_amt.db")
	if err != nil {
		fmt.Println("Error opening database connection:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close() // Close the database connection after the function returns

	// Define the SQL query to retrieve tickets
	rows, err := db.Query("SELECT ticketID, username, description, status FROM tickets")
	if err != nil {
		fmt.Println("Error querying database:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer rows.Close() // Close the rows after the function returns

	// Create a slice to store the retrieved tickets
	var tickets []Ticket

	// Scan each row and add ticket data to the slice
	for rows.Next() {
		var ticket Ticket
		err := rows.Scan(&ticket.TicketID, &ticket.Username, &ticket.Description, &ticket.Status)
		if err != nil {
			fmt.Println("Error scanning row:", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		tickets = append(tickets, ticket)
	}

	// Encode the tickets slice to JSON
	jsonData, err := json.Marshal(tickets)
	if err != nil {
		fmt.Println("Error marshalling tickets to JSON:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Set the content type header and write the JSON response
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func main() {
	// Define the port to listen on
	port := ":3000"

	// Register the handler for all requests
	http.HandleFunc("/", serveStatic)
	http.HandleFunc("/node/ben/getTickets", getTickets)
	// Start the server
	fmt.Println("Server listening on port", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
