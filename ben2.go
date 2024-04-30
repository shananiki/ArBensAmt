package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath" // Import the filepath package

	_ "modernc.org/sqlite"
)

type Ticket struct {
	TicketID    int    `json:"ticketID"`
	Username    string `json:"username"`
	Description string `json:"description"`
	Status      int    `json:"status"`
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	// Define the root directory for static files
	staticRoot := http.Dir("public")

	// Serve the requested file from the static directory
	http.ServeFile(w, r, filepath.Join(string(staticRoot), r.URL.Path))
}

func getTickets(w http.ResponseWriter, r *http.Request) {
	// Open the database connection
	db, err := sql.Open("sqlite", "das_amt.db")
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

func newTicketHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// Decode the request body into a map
	var data map[string]interface{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&data); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error decoding request body: %v", err)
		return
	}

	// Extract data from the request body
	name, ok := data["creatorName"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Missing required field: creatorName")
		return
	}
	description, ok := data["description"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Missing required field: description")
		return
	}

	// Open a database connection (replace with your connection logic)
	db, err := sql.Open("sqlite", "das_amt.db")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error opening database connection: %v", err)
		return
	}
	defer db.Close()

	// Prepare the SQL statement with placeholders
	sql := "INSERT INTO tickets (username, description, status) VALUES (?, ?, ?)"

	// Execute the insert query with parameters
	stmt, err := db.Prepare(sql)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error preparing SQL statement: %v", err)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(name, description, 0)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error inserting ticket: %v", err)
		return
	}

	// Respond with success message
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Ticket created successfully")
}

func main() {
	// Define the port to listen on
	port := ":3000"

	// Register the handler for all requests
	http.HandleFunc("/", serveStatic)
	http.HandleFunc("/node/ben/getTickets", getTickets)
	http.HandleFunc("/node/ben/newTicket", newTicketHandler)
	// Start the server
	fmt.Println("Server listening on port", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
