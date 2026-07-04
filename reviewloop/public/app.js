// ReviewLoop dashboard (vanilla JS, no build step).
const $ = (sel) => document.querySelector(sel);

let state = { overview: null, selectedId: null, detail: null };

async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: opts.body && typeof opts.body === 'string' && !opts.csv
      ? { 'Content-Type': 'application/json' }
      : opts.csv ? { 'Content-Type': 'text/csv' } : {},
    ...opts,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
  return res.json();
}

// --- overview / business list -------------------------------------------------

async function loadOverview() {
  state.overview = await api('/api/overview');
  const o = state.overview;
  $('#channel-status').textContent =
    `email ${o.emailLive ? 'LIVE' : 'dry-run'} · sms ${o.smsLive ? 'LIVE' : 'dry-run'} · places ${o.placesEnabled ? 'on' : 'off'}`;
  renderBizList();
  if (!state.selectedId && o.businesses.length) selectBiz(o.businesses[0].id);
  else if (state.selectedId) selectBiz(state.selectedId);
}

function renderBizList() {
  const el = $('#biz-list');
  el.innerHTML = '';
  for (const b of state.overview.businesses) {
    const chip = document.createElement('button');
    chip.className = 'biz-chip' + (b.id === state.selectedId ? ' active' : '');
    chip.textContent = `${b.name} (${b.stats.enrolled})`;
    chip.onclick = () => selectBiz(b.id);
    el.appendChild(chip);
  }
  if (!state.overview.businesses.length) {
    el.innerHTML = '<span class="muted">No businesses yet — add your first one.</span>';
  }
}

async function selectBiz(bizId) {
  state.selectedId = bizId;
  state.detail = await api(`/api/businesses/${bizId}`);
  renderBizList();
  renderDetail();
}

// --- detail -------------------------------------------------------------------

function stat(num, lbl) {
  return `<div class="stat"><div class="num">${num}</div><div class="lbl">${lbl}</div></div>`;
}

function renderDetail() {
  const d = state.detail;
  $('#detail').classList.remove('hidden');
  $('#detail-name').textContent = d.name;
  $('#detail-sub').textContent = `Review link: ${d.reviewUrl || '(none set)'} · daily cap ${d.dailyCap} · send window ${d.sendStartHour}:00–${d.sendEndHour}:00`;
  $('#qr-link').href = `/qr/${d.id}`;
  $('#review-link').href = d.reviewUrl || '#';
  $('#pause-btn').textContent = d.paused ? '▶ Resume sending' : '⏸ Pause sending';

  const s = d.stats;
  $('#stats').innerHTML =
    stat(s.enrolled, 'Enrolled') +
    stat(s.sent, 'Requests sent') +
    stat(s.clicked, 'Clicked') +
    stat(Math.round(s.clickRate * 100) + '%', 'Click rate') +
    (s.reviewsGained != null
      ? stat('+' + s.reviewsGained, 'Reviews gained')
      : stat(s.currentTotal ?? '—', 'Google reviews')) +
    stat(s.currentRating ?? '—', 'Rating');

  $('#webhook-snippet').textContent =
`curl -X POST ${location.origin}/api/hooks/visit \\
  -H "Content-Type: application/json" \\
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \\
  -d '{"businessId":"${d.id}","name":"Jane","email":"jane@example.com","phone":"+15550001111"}'`;

  renderSequence(d.sequence);
  renderCustomers(d.customers);
}

function renderSequence(sequence) {
  const el = $('#sequence-editor');
  el.innerHTML = '';
  sequence.forEach((step, i) => {
    const row = document.createElement('div');
    row.className = 'step-row';
    row.innerHTML = `
      <select data-i="${i}" data-k="channel">
        <option value="email" ${step.channel === 'email' ? 'selected' : ''}>Email</option>
        <option value="sms" ${step.channel === 'sms' ? 'selected' : ''}>SMS</option>
      </select>
      <label class="row" style="gap:.4rem">send after
        <input type="number" min="0" style="width:6rem" data-i="${i}" data-k="delayHours" value="${step.delayHours}"> hours
        <span class="muted small">${i === 0 ? 'after the visit' : 'after the previous message'}</span>
      </label>
      <button class="btn" data-remove="${i}" title="Remove step">✕</button>`;
    el.appendChild(row);
  });
  el.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.onclick = () => {
      state.detail.sequence.splice(Number(btn.dataset.remove), 1);
      renderSequence(state.detail.sequence);
    };
  });
  el.querySelectorAll('select,input').forEach((inp) => {
    inp.onchange = () => {
      const step = state.detail.sequence[Number(inp.dataset.i)];
      step[inp.dataset.k] = inp.dataset.k === 'delayHours' ? Number(inp.value) : inp.value;
    };
  });
}

function renderCustomers(customers) {
  const tbody = $('#cust-table tbody');
  tbody.innerHTML = '';
  for (const c of customers) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name || '—'}</td>
      <td class="small">${[c.email, c.phone].filter(Boolean).join('<br>') || '—'}</td>
      <td><span class="badge ${c.status}">${c.status}</span></td>
      <td>${c.step}</td>
      <td class="small">${c.nextSendAt ? new Date(c.nextSendAt).toLocaleString() : '—'}</td>
      <td>${c.status === 'active' ? `<button class="btn small" data-send="${c.id}">Send now</button>` : ''}</td>`;
    tbody.appendChild(tr);
  }
  if (!customers.length) tbody.innerHTML = '<tr><td colspan="6" class="muted">No customers enrolled yet.</td></tr>';
  tbody.querySelectorAll('[data-send]').forEach((btn) => {
    btn.onclick = async () => {
      btn.disabled = true;
      try {
        await api(`/api/businesses/${state.selectedId}/send-now/${btn.dataset.send}`, { method: 'POST' });
        await selectBiz(state.selectedId);
      } catch (e) { alert(e.message); }
    };
  });
}

// --- forms ----------------------------------------------------------------------

$('#show-add-biz').onclick = () => $('#add-biz-form').classList.toggle('hidden');
$('#cancel-add-biz').onclick = () => $('#add-biz-form').classList.add('hidden');

$('#add-biz-form').onsubmit = async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  try {
    const biz = await api('/api/businesses', {
      method: 'POST',
      body: JSON.stringify({
        name: f.get('name'),
        placeId: f.get('placeId') || undefined,
        reviewLink: f.get('reviewLink') || undefined,
      }),
    });
    e.target.reset();
    e.target.classList.add('hidden');
    state.selectedId = biz.id;
    await loadOverview();
  } catch (err) { alert(err.message); }
};

$('#add-cust-form').onsubmit = async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  try {
    await api(`/api/businesses/${state.selectedId}/customers`, {
      method: 'POST',
      body: JSON.stringify({
        name: f.get('name'), email: f.get('email'), phone: f.get('phone'),
      }),
    });
    e.target.reset();
    await loadOverview();
  } catch (err) { alert(err.message); }
};

$('#csv-form').onsubmit = async (e) => {
  e.preventDefault();
  const csv = new FormData(e.target).get('csv');
  try {
    const r = await api(`/api/businesses/${state.selectedId}/customers/csv`, {
      method: 'POST', body: csv, csv: true,
    });
    $('#csv-result').textContent = `Parsed ${r.parsed}, enrolled ${r.enrolled}, skipped ${r.skipped}.`;
    e.target.reset();
    await loadOverview();
  } catch (err) { alert(err.message); }
};

$('#add-step').onclick = () => {
  state.detail.sequence.push({ channel: 'email', delayHours: 72 });
  renderSequence(state.detail.sequence);
};

$('#save-sequence').onclick = async () => {
  try {
    await api(`/api/businesses/${state.selectedId}`, {
      method: 'PATCH',
      body: JSON.stringify({ sequence: state.detail.sequence }),
    });
    $('#seq-result').textContent = 'Saved.';
    setTimeout(() => ($('#seq-result').textContent = ''), 2000);
  } catch (err) { alert(err.message); }
};

$('#pause-btn').onclick = async () => {
  await api(`/api/businesses/${state.selectedId}`, {
    method: 'PATCH',
    body: JSON.stringify({ paused: !state.detail.paused }),
  });
  await selectBiz(state.selectedId);
};

loadOverview().catch((e) => alert('Failed to load: ' + e.message));
setInterval(() => loadOverview().catch(() => {}), 30_000);
