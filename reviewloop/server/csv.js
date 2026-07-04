// Minimal CSV parser: handles quoted fields, commas and newlines in quotes.
// First row is treated as a header. Header names are matched loosely
// (case-insensitive, common synonyms) to { name, email, phone, visitedAt }.

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const pushField = () => { row.push(field); field = ''; };
  const pushRow = () => {
    if (row.length > 1 || row[0] !== '') rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') pushField();
    else if (ch === '\n') { pushField(); pushRow(); }
    else if (ch !== '\r') field += ch;
  }
  pushField();
  pushRow();
  return rows;
}

const HEADER_MAP = [
  [/^(customer[ _]?)?name|full[ _]?name|first[ _]?name$/i, 'name'],
  [/^e-?mail( address)?$/i, 'email'],
  [/^phone( number)?|mobile|cell$/i, 'phone'],
  [/^visit(ed)?([ _]?(at|date))?|date|purchase[ _]?date|order[ _]?date$/i, 'visitedAt'],
];

export function csvToCustomers(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => {
    const clean = h.trim();
    for (const [re, key] of HEADER_MAP) if (re.test(clean)) return key;
    return null;
  });
  // If no recognizable header, assume name,email,phone order with no header row.
  const hasHeader = header.some(Boolean);
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const cols = hasHeader ? header : ['name', 'email', 'phone'];

  return dataRows
    .map((r) => {
      const c = {};
      r.forEach((val, i) => {
        if (cols[i]) c[cols[i]] = val.trim();
      });
      return c;
    })
    .filter((c) => c.email || c.phone);
}
