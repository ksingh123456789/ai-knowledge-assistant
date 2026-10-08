import { useState } from "react";

const API_URL = "http://localhost:8000";

type Ticket = {
  id: string;
  title: string;
  priority: string;
  status: string;
};

export default function JiraTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "AD-101",
      title:
        "Create a new simple login form and show below AI Coding Agent Tickets section",
      priority: "High",
      status: "Open",
    },
    {
      id: "AD-102",
      title: "Fix CSS issue on dashboard",
      priority: "Medium",
      status: "Open",
    },
    {
      id: "AD-103",
      title: "Create new API endpoint for users",
      priority: "High",
      status: "Open",
    },
  ]);

  const handleExecute = async (ticket: Ticket) => {
    setTickets(
      tickets.map((t: any) =>
        t.id === ticket.id ? { ...t, status: "Queued for AI..." } : t,
      ),
    );

    try {
      const response = await fetch(`${API_URL}/api/start-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket_id: ticket.id,
          requirement: ticket.title,
        }),
      });

      if (response.ok) {
        alert(`Ticket ${ticket.id} sent to the AI Agent!`);
      } else {
        alert("Failed to send ticket to AI Agent.");
        setTickets(
          tickets.map((t: any) =>
            t.id === ticket.id ? { ...t, status: "Open" } : t,
          ),
        );
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("Make sure your Python API server is running!");
      setTickets(
        tickets.map((t) => (t.id === ticket.id ? { ...t, status: "Open" } : t)),
      );
    }
  };

  return (
    <section className="card">
      <h2>AI Coding Agent Tickets</h2>
      <p>Select a ticket to execute with the LangGraph agent.</p>

      <table
        border={1}
        cellPadding={10}
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th>Ticket ID</th>
            <th>Requirement</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>
                <strong>{ticket.id}</strong>
              </td>
              <td>{ticket.title}</td>
              <td
                style={{ color: ticket.priority === "High" ? "red" : "orange" }}
              >
                {ticket.priority}
              </td>
              <td>
                <span
                  style={{
                    padding: "5px",
                    borderRadius: "4px",
                    backgroundColor: ticket.status.includes("Queued")
                      ? "yellow"
                      : "transparent",
                    color: ticket.status.includes("Queued")
                      ? "black"
                      : "inherit",
                  }}
                >
                  {ticket.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleExecute(ticket)}
                  disabled={ticket.status !== "Open"}
                  style={{
                    padding: "8px 16px",
                    backgroundColor:
                      ticket.status === "Open" ? "#0052CC" : "#ccc",
                    color: "white",
                    border: "none",
                    cursor:
                      ticket.status === "Open" ? "pointer" : "not-allowed",
                    borderRadius: "4px",
                  }}
                >
                  Execute with AI
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
