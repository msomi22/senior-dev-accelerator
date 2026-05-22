export default function ProblemTableBlock({ block }) {
  const columns = Array.isArray(block.columns) ? block.columns : [];
  const rows = Array.isArray(block.rows) ? block.rows : [];

  if (!columns.length || !rows.length) {
    return (
      <section className="workspace-block problem-rich-block problem-rich-empty">
        <span className="mini-label">Table</span>
        <p>This table block has no columns or rows.</p>
      </section>
    );
  }

  return (
    <section className="workspace-block problem-rich-block problem-table-block">
      {block.title ? <span className="mini-label">{block.title}</span> : <span className="mini-label">Table</span>}
      <div className="problem-table-scroll">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {columns.map((column, columnIndex) => (
                  <td data-label={column} key={`${rowIndex}-${column}`}>
                    {Array.isArray(row) ? row[columnIndex] : row?.[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
