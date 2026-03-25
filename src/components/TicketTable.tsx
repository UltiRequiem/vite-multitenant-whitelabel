interface Ticket {
  id: string
  title: string
  status: 'open' | 'pending' | 'closed'
  assignee: string
  priority: string
}

interface TicketTableProps {
  tickets: Ticket[]
  showExport: boolean
}

export default function TicketTable({ tickets, showExport }: TicketTableProps) {
  function handleExport() {
    const csv = [
      'ID,Title,Status,Assignee,Priority',
      ...tickets.map(t => `${t.id},"${t.title}",${t.status},${t.assignee},${t.priority}`),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tickets.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="ticket-table-wrap">
      <div className="ticket-table-header">
        <h3>Recent tickets</h3>
        {showExport && (
          <button className="btn btn-secondary" onClick={handleExport}>
            Export CSV
          </button>
        )}
      </div>
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>
                <span className={`badge badge-${ticket.status}`}>
                  {ticket.status}
                </span>
              </td>
              <td>{ticket.assignee}</td>
              <td>{ticket.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
