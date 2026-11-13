import './style.css';

const shareholders = [
  { id: 'INV-001', name: 'Alice Johnson', shares: 100 },
  { id: 'INV-002', name: 'Bob Smith', shares: 250 },
  { id: 'INV-003', name: 'Carol Davis', shares: 150 },
];
let dividend = null;
let activity = [];
const money = value => '₹' + Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const totalShares = () => shareholders.reduce((sum, person) => sum + person.shares, 0);

function render() {
  const total = totalShares();
  const pool = dividend?.pool ?? 0;
  document.querySelector('#app').innerHTML = `
    <header><div><h1>CorpChain</h1><p>Corporate actions & dividend distribution</p></div><span class="demo-tag">DEMO DATA</span></header>
    <main>
      <section class="stats">
        <article><span>Total shareholders</span><strong>${shareholders.length}</strong></article>
        <article><span>Total shares</span><strong>${total.toLocaleString('en-IN')}</strong></article>
        <article><span>Dividend pool</span><strong>${money(pool)}</strong></article>
        <article><span>Dividend status</span><strong class="status">${dividend ? 'Declared' : 'Not declared'}</strong></article>
      </section>
      <section class="panel">
        <div class="section-heading"><h2>Shareholder register</h2><span>Ownership at snapshot</span></div>
        <div class="table-wrap"><table><thead><tr><th>Investor ID</th><th>Shareholder</th><th>Shares</th><th>Ownership</th><th>Dividend</th><th>Payment</th></tr></thead><tbody>
          ${shareholders.map(p => { const amount = dividend ? p.shares / total * pool : 0; const paid = dividend?.paid?.includes(p.id); return `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.shares}</td><td>${(p.shares / total * 100).toFixed(1)}%</td><td>${dividend ? money(amount) : '—'}</td><td>${paid ? '<span class="paid">Paid</span>' : dividend ? '<span class="pending">Pending</span>' : '—'}</td></tr>`; }).join('')}
        </tbody></table></div>
      </section>
      <section class="columns">
        <div class="panel">
          <h2>Declare dividend</h2>
          <p class="muted">Enter a dividend amount per share. The demo calculates each investor's entitlement automatically.</p>
          <form id="declare-form">
            <label>Corporate action<input name="description" value="FY2025 Final Dividend" required /></label>
            <label>Dividend per share (₹)<input name="perShare" type="number" min="0.01" step="0.01" value="10" required /></label>
            <div class="calculation"><span>Total distribution</span><strong id="preview">${money(total * 10)}</strong></div>
            <button type="submit">Declare dividend</button>
          </form>
        </div>
        <div class="panel">
          <h2>Distribution summary</h2>
          ${dividend ? `<div class="summary-line"><span>Corporate action</span><strong>${escapeHtml(dividend.description)}</strong></div><div class="summary-line"><span>Dividend per share</span><strong>${money(dividend.perShare)}</strong></div><div class="summary-line"><span>Snapshot shares</span><strong>${total.toLocaleString('en-IN')}</strong></div><div class="summary-line"><span>Total distribution</span><strong>${money(dividend.pool)}</strong></div><button id="pay-button" class="secondary" ${dividend.paid.length === shareholders.length ? 'disabled' : ''}>Mark all distributions as paid</button>` : '<p class="empty">No dividend has been declared yet.</p>'}
        </div>
      </section>
      <section class="panel"><h2>Demo activity</h2><div id="activity">${activity.length ? activity.map(item => `<div class="activity-row"><span>${escapeHtml(item)}</span></div>`).join('') : '<p class="empty">No activity yet. Declare a dividend to begin the demonstration.</p>'}</div></section>
      <footer>Academic demonstration only · Simulated data · No real payments or blockchain transactions</footer>
    </main>`;

  const perShareInput = document.querySelector('[name="perShare"]');
  perShareInput.addEventListener('input', () => {
    const amount = Math.max(0, Number(perShareInput.value) || 0);
    document.querySelector('#preview').textContent = money(amount * total);
  });
  document.querySelector('#declare-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const perShare = Number(form.get('perShare'));
    const description = String(form.get('description')).trim();
    if (!description || perShare <= 0) return;
    dividend = { description, perShare, pool: perShare * total, paid: [] };
    activity.unshift(`Dividend declared: ${description} — ${money(perShare)} per share (${money(dividend.pool)} total).`);
    render();
  });
  document.querySelector('#pay-button')?.addEventListener('click', () => {
    dividend.paid = shareholders.map(p => p.id);
    activity.unshift(`Distribution completed: ${money(dividend.pool)} marked as paid to ${shareholders.length} shareholders.`);
    render();
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

render();
