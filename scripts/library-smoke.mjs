import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const apiUrl = (process.env.API_URL ?? 'http://localhost:3001/api').replace(/\/+$/, '');
const composeFile =
  process.env.COMPOSE_FILE ??
  fileURLToPath(
    new URL('../infrastructure/docker/docker-compose.yml', import.meta.url)
  );

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, options);
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} failed (${response.status}): ${JSON.stringify(body)}`);
  }
  return body;
}

function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'docker',
      [
        'compose',
        '-f',
        composeFile,
        'exec',
        '-T',
        'postgres',
        'sh',
        '-c',
        'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB"',
      ],
      { stdio: ['pipe', 'inherit', 'inherit'] }
    );
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`psql exited with status ${code}`));
    });
    child.stdin.end(sql);
  });
}

async function main() {
  const login = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: process.env.LIBRARIAN_EMAIL ?? 'librarian@paideon.local',
      password: process.env.LIBRARIAN_PASSWORD ?? 'LibraryDesk!2026',
    }),
  });
  const accessToken = login?.data?.accessToken ?? login?.accessToken;
  if (!accessToken) throw new Error('Login did not return an access token.');
  const headers = { Authorization: `Bearer ${accessToken}` };
  const marker = Date.now();
  const barcode = `PAI-SMOKE-${marker}`;
  const csv = [
    'title,author,isbn,category,copies,starting barcode',
    `Circulation smoke ${marker},Smoke Author ${marker},,Test,1,${barcode}`,
  ].join('\n');
  const upload = new FormData();
  upload.append('file', new Blob([csv], { type: 'text/csv' }), 'smoke.csv');
  const imported = await request('/library/books/import', {
    method: 'POST',
    headers,
    body: upload,
  });
  if (imported.created !== 1 || imported.errors !== 0) {
    throw new Error(`Unexpected CSV import result: ${JSON.stringify(imported)}`);
  }

  const checkout = await request('/library/circulation/checkout', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberBarcode: process.env.STUDENT_CARD ?? 'PAI-STU-CARD-0001',
      copyBarcode: barcode,
    }),
  });
  const loanId = checkout?.loan?.id;
  if (!loanId || !/^[A-Za-z0-9]+$/.test(loanId)) {
    throw new Error('Checkout did not return a valid loan ID.');
  }
  await executeSql(
    `UPDATE "Loan" SET "dueDate" = CURRENT_TIMESTAMP - INTERVAL '3 days' WHERE "id" = '${loanId}';`
  );

  const returned = await request('/library/circulation/return', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ copyBarcode: barcode }),
  });
  if (!returned.fine || returned.daysOverdue < 3) {
    throw new Error(`Late return did not create an overdue fine: ${JSON.stringify(returned)}`);
  }
  const fines = await request(
    `/library/fines?memberId=${encodeURIComponent(checkout.member.id)}`,
    { headers }
  );
  if (!fines.some((fine) => fine.loanId === loanId && fine.status === 'PENDING')) {
    throw new Error('The late-return fine was not present in the unpaid fine list.');
  }
  console.log('Library smoke passed: login, CSV import, checkout, late return, fine verified.');
}

main().catch((error) => {
  console.error('Library smoke failed:', error);
  process.exitCode = 1;
});
