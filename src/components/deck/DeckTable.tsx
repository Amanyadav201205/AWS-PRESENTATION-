import { DeckTable as DeckTableData } from '../../data/deck/deckTypes';

interface DeckTableProps {
  table: DeckTableData;
  caption?: string;
}

/** A real HTML table with header cells, so screen readers announce the column for each value. */
export const DeckTable: React.FC<DeckTableProps> = ({ table, caption }) => {
  const [firstHeader, ...otherHeaders] = table.headers;
  return (
    <table className="deck-table">
      {caption && <caption className="deck-table-caption">{caption}</caption>}
      <thead>
        <tr>
          <th scope="col">{firstHeader}</th>
          {otherHeaders.map((header) => (
            <th scope="col" key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row) => (
          <tr key={row.join('|')}>
            <th scope="row">{row[0]}</th>
            {row.slice(1).map((cell, index) => (
              <td key={`${row[0]}-${table.headers[index + 1]}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
