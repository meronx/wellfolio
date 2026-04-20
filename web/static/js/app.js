'use strict';

/* ══════════════════════════════════════════════════════════════
   State
══════════════════════════════════════════════════════════════ */
const state = {
  portfolio: null,
  transactions: [],
  charts: { allocation: null, performance: null, dividends: null, typeChart: null },
};

/* ══════════════════════════════════════════════════════════════
   Utilities
══════════════════════════════════════════════════════════════ */
const fmt = (v, decimals = 2) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);

const fmtMoney = (v, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(v);
  } catch { return `$${fmt(v)}`; }
};

const fmtPct = v => `${v >= 0 ? '+' : ''}${fmt(v)}%`;
const fmtDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

function sign(v, cls = true) {
  if (!cls) return v >= 0 ? '+' : '';
  return v >= 0 ? 'positive' : 'negative';
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 3500);
}

/* ══════════════════════════════════════════════════════════════
   API helpers
══════════════════════════════════════════════════════════════ */
async function api(path, opts = {}) {
  const r = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || r.statusText);
  }
  return r.json();
}

const fetchPortfolio     = () => api('/api/portfolio');
const fetchTransactions  = (type = '') => api(`/api/transactions${type ? `?type=${type}` : ''}`);
const fetchCharts        = () => api('/api/charts');
const searchStocks       = q => api(`/api/search?q=${encodeURIComponent(q)}`);
const getQuote           = sym => api(`/api/quote/${encodeURIComponent(sym)}`);

const createTransaction  = data => api('/api/transactions', { method: 'POST', body: JSON.stringify(data) });
const updateTransaction  = (id, data) => api(`/api/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
const deleteTransaction  = id => api(`/api/transactions/${id}`, { method: 'DELETE' });

/* ══════════════════════════════════════════════════════════════
   Navigation
══════════════════════════════════════════════════════════════ */
const pages = {
  dashboard:    document.getElementById('page-dashboard'),
  holdings:     document.getElementById('page-holdings'),
  transactions: document.getElementById('page-transactions'),
  analytics:    document.getElementById('page-analytics'),
};

const pageTitles = {
  dashboard: 'Dashboard',
  holdings: 'Holdings',
  transactions: 'Transactions',
  analytics: 'Analytics',
};

function navigateTo(page) {
  if (!pages[page]) return;
  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[page].classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
  document.getElementById('pageTitle').textContent = pageTitles[page] || page;

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');

  if (page === 'holdings') renderHoldingsPage();
  if (page === 'analytics') renderAnalyticsPage();
}

/* ══════════════════════════════════════════════════════════════
   Dashboard rendering
══════════════════════════════════════════════════════════════ */
function renderDashboard() {
  const p = state.portfolio;
  if (!p) return;

  const grandTotal = p.total_value + p.cash_balance;

  const setMetric = (id, value, sub, cls) => {
    const el = document.getElementById(id);
    if (el) { el.textContent = value; if (cls) el.className = `metric-value ${cls}`; }
    const sel = document.getElementById(id.replace('mv-', 'ms-'));
    if (sel && sub !== undefined) sel.textContent = sub;
  };

  setMetric('mv-total', fmtMoney(grandTotal), `Invested: ${fmtMoney(p.total_cost)}`);
  setMetric('mv-unrealized',
    fmtMoney(p.total_unrealized_gain),
    fmtPct(p.total_unrealized_gain_pct),
    sign(p.total_unrealized_gain));
  setMetric('mv-day',
    fmtMoney(p.day_change),
    fmtPct(p.day_change_pct),
    sign(p.day_change));
  setMetric('mv-cash', fmtMoney(p.cash_balance));

  renderAllocationChart();
  renderRecentTransactions();
}

function renderAllocationChart() {
  const p = state.portfolio;
  if (!p || !p.holdings || p.holdings.length === 0) return;

  const canvas = document.getElementById('allocationChart');
  try {
    if (state.charts.allocation) state.charts.allocation.destroy();

    const palette = [
      '#6366f1','#3fb950','#f85149','#d29922','#388bfd',
      '#a5b4fc','#34d399','#fb7185','#fbbf24','#60a5fa',
      '#818cf8','#4ade80','#f43f5e','#facc15','#38bdf8',
    ];

    const labels = p.holdings.map(h => h.symbol);
    const data   = p.holdings.map(h => h.current_value || h.total_cost);
    const colors = p.holdings.map((_, i) => palette[i % palette.length]);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#8b949e' : '#656d76';

    state.charts.allocation = new Chart(canvas, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: isDark ? '#161b22' : '#fff' }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, padding: 12, font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${fmtMoney(ctx.parsed)} (${fmt(p.holdings[ctx.dataIndex].weight)}%)`,
            },
          },
        },
      },
    });
  } catch (e) { console.error('Allocation chart error:', e); }
}

function renderPerformanceChart(chartData) {
  const canvas = document.getElementById('performanceChart');
  try {
    if (state.charts.performance) state.charts.performance.destroy();
    if (!chartData || !chartData.invested || chartData.invested.length === 0) return;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#8b949e' : '#656d76';
    const gridColor = isDark ? 'rgba(48,54,61,.5)' : 'rgba(208,215,222,.5)';

    state.charts.performance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: chartData.invested.map(p => p.date),
        datasets: [{
          label: 'Invested Capital',
          data: chartData.invested.map(p => p.value),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } },
          tooltip: { callbacks: { label: ctx => ` ${fmtMoney(ctx.parsed.y)}` } },
        },
      scales: {
        x: { ticks: { color: textColor, maxRotation: 0, maxTicksLimit: 8 }, grid: { color: gridColor } },
        y: {
          ticks: { color: textColor, callback: v => fmtMoney(v, 'USD') },
          grid: { color: gridColor },
        },
      },
    },
  });
  } catch (e) { console.error('Performance chart error:', e); }
}

function renderRecentTransactions() {
  const wrap = document.getElementById('recentTxns');
  const recent = state.transactions.slice(0, 8);
  if (!recent.length) {
    wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-receipt"></i><p>No transactions yet</p></div>`;
    return;
  }
  wrap.innerHTML = buildTransactionTable(recent, false);
}

/* ══════════════════════════════════════════════════════════════
   Holdings page
══════════════════════════════════════════════════════════════ */
function renderHoldingsPage() {
  const p = state.portfolio;
  if (!p) return;

  const wrap = document.getElementById('holdingsTable');
  if (!p.holdings || p.holdings.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-briefcase"></i><p>No holdings yet</p></div>`;
  } else {
    wrap.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Symbol</th><th>Name</th><th>Qty</th>
            <th>Avg Cost</th><th>Current Price</th><th>Market Value</th>
            <th>Unrealized P&L</th><th>Day Change</th><th>Weight</th>
          </tr>
        </thead>
        <tbody>
          ${p.holdings.map(h => `
            <tr>
              <td><strong class="positive">${h.symbol}</strong></td>
              <td class="muted">${h.name || '–'}</td>
              <td>${fmt(h.quantity, 4)}</td>
              <td>${fmtMoney(h.average_cost, h.currency)}</td>
              <td>${h.current_price ? fmtMoney(h.current_price, h.currency) : '<span class="muted">–</span>'}</td>
              <td><strong>${h.current_value ? fmtMoney(h.current_value, h.currency) : '–'}</strong></td>
              <td class="${sign(h.unrealized_gain)}">
                ${h.current_price ? `${fmtMoney(h.unrealized_gain, h.currency)}<br><small>${fmtPct(h.unrealized_gain_pct)}</small>` : '–'}
              </td>
              <td class="${sign(h.day_change)}">
                ${h.current_price ? `${fmtMoney(h.day_change, h.currency)}<br><small>${fmtPct(h.day_change_pct)}</small>` : '–'}
              </td>
              <td>${fmt(h.weight)}%</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  // Additional metrics
  setEl('mv-realized',  fmtMoney(p.total_realized_gain), sign(p.total_realized_gain));
  setEl('mv-dividends', fmtMoney(p.total_dividends));
  setEl('mv-interest',  fmtMoney(p.total_interest));
  setEl('mv-fees',      fmtMoney(p.total_fees));
}

function setEl(id, text, cls = '') {
  const el = document.getElementById(id);
  if (el) { el.textContent = text; if (cls) el.className = `metric-value ${cls}`; }
}

/* ══════════════════════════════════════════════════════════════
   Transactions page
══════════════════════════════════════════════════════════════ */
function renderTransactionsPage() {
  const wrap = document.getElementById('transactionsTable');
  if (!state.transactions.length) {
    wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-list-ul"></i><p>No transactions yet</p></div>`;
    return;
  }
  wrap.innerHTML = buildTransactionTable(state.transactions, true);
}

function buildTransactionTable(txns, withActions) {
  return `
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Type</th><th>Symbol</th>
          <th>Qty / Ratio</th><th>Price</th><th>Amount</th><th>Fees</th>
          ${withActions ? '<th>Actions</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${txns.map(t => `
          <tr>
            <td class="muted">${fmtDate(t.date)}</td>
            <td><span class="badge badge-${t.type}">${t.type.replace('_', ' ')}</span></td>
            <td><strong>${t.symbol || '–'}</strong></td>
            <td>${t.quantity ? fmt(t.quantity, 4) : '–'}</td>
            <td>${t.price ? fmtMoney(t.price, t.currency) : '–'}</td>
            <td>${t.amount ? fmtMoney(t.amount, t.currency) : '–'}</td>
            <td>${t.fees ? fmtMoney(t.fees, t.currency) : '–'}</td>
            ${withActions ? `
            <td>
              <div class="action-btns">
                <button class="icon-btn edit" onclick="openEdit(${t.id})" title="Edit">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="icon-btn delete" onclick="confirmDelete(${t.id})" title="Delete">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>` : ''}
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ══════════════════════════════════════════════════════════════
   Analytics page
══════════════════════════════════════════════════════════════ */
function renderAnalyticsPage() {
  fetchCharts().then(data => {
    renderDividendsChart(data.dividends);
  }).catch(console.error);

  // Type breakdown pie from local transaction data
  renderTypeChart();

  const p = state.portfolio;
  if (p) {
    setEl('mv-taxes', fmtMoney(p.total_taxes));
    setEl('mv-income', fmtMoney(p.total_dividends + p.total_interest));

    // Compute deposited / withdrawn from transactions
    let deposited = 0, withdrawn = 0;
    state.transactions.forEach(t => {
      if (t.type === 'deposit')    deposited  += t.amount;
      if (t.type === 'withdrawal') withdrawn  += t.amount;
    });
    setEl('mv-deposited', fmtMoney(deposited));
    setEl('mv-withdrawn',  fmtMoney(withdrawn));
  }
}

function renderDividendsChart(dividends) {
  const canvas = document.getElementById('dividendsChart');
  try {
    if (state.charts.dividends) state.charts.dividends.destroy();
    if (!dividends || dividends.length === 0) return;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#8b949e' : '#656d76';
    const gridColor = isDark ? 'rgba(48,54,61,.5)' : 'rgba(208,215,222,.5)';

    state.charts.dividends = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: dividends.map(d => d.date),
        datasets: [{
          label: 'Dividends',
          data: dividends.map(d => d.value),
          backgroundColor: 'rgba(210,153,34,.7)',
          borderColor: '#d29922',
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } },
          tooltip: { callbacks: { label: ctx => ` ${fmtMoney(ctx.parsed.y)}` } },
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor, callback: v => fmtMoney(v) }, grid: { color: gridColor } },
        },
      },
    });
  } catch (e) { console.error('Dividends chart error:', e); }
}

function renderTypeChart() {
  const canvas = document.getElementById('typeChart');
  try {
    if (state.charts.typeChart) state.charts.typeChart.destroy();
    if (!state.transactions.length) return;

    const counts = {};
    state.transactions.forEach(t => { counts[t.type] = (counts[t.type] || 0) + 1; });

    const palette = {
      buy: '#3fb950', sell: '#f85149', split: '#388bfd',
      dividend: '#d29922', interest_earning: '#fbbf24',
      tax: '#fb7185', withdrawal: '#f43f5e', deposit: '#34d399',
    };

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#8b949e' : '#656d76';

    state.charts.typeChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: Object.keys(counts).map(k => k.replace('_', ' ')),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: Object.keys(counts).map(k => palette[k] || '#6366f1'),
          borderWidth: 2,
          borderColor: isDark ? '#161b22' : '#fff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, padding: 10, font: { size: 11 } } },
        },
      },
    });
  } catch (e) { console.error('Type chart error:', e); }
}

/* ══════════════════════════════════════════════════════════════
   Modal – Add / Edit Transaction
══════════════════════════════════════════════════════════════ */
const STOCK_TYPES = ['buy', 'sell', 'split', 'dividend'];

function openModal(txn = null) {
  const modal = document.getElementById('modalOverlay');
  const form  = document.getElementById('txnForm');
  form.reset();
  document.getElementById('txnId').value = '';
  document.getElementById('modalTitle').textContent = txn ? 'Edit Transaction' : 'Add Transaction';

  if (txn) {
    document.getElementById('txnId').value     = txn.id;
    document.getElementById('txnType').value   = txn.type;
    document.getElementById('txnDate').value   = txn.date.substring(0, 10);
    document.getElementById('txnSymbol').value = txn.symbol || '';
    document.getElementById('txnName').value   = txn.name || '';
    document.getElementById('txnQty').value    = txn.quantity || '';
    document.getElementById('txnPrice').value  = txn.price || '';
    document.getElementById('txnAmount').value = txn.amount || '';
    document.getElementById('txnFees').value   = txn.fees || '';
    document.getElementById('txnCurrency').value = txn.currency || 'USD';
    document.getElementById('txnNotes').value  = txn.notes || '';
    updateFormFields(txn.type);
  } else {
    // Default date to today
    document.getElementById('txnDate').value = new Date().toISOString().substring(0, 10);
    updateFormFields('');
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function updateFormFields(type) {
  const isStock    = STOCK_TYPES.includes(type);
  const isSplit    = type === 'split';
  const isCash     = ['deposit', 'withdrawal', 'interest_earning', 'tax'].includes(type);
  const isDividend = type === 'dividend';

  document.getElementById('symbolRow').style.display =
    (isStock || isDividend) ? '' : 'none';

  document.getElementById('qtyPriceRow').style.display =
    (isCash) ? 'none' : '';

  // Label adjustments
  document.getElementById('qtyLabel').textContent = isSplit ? 'Split Ratio (e.g. 2)' : 'Quantity';
  document.getElementById('amountLabel').textContent =
    isDividend ? 'Dividend Amount' : (isCash ? 'Amount' : 'Amount (auto)');

  const amountGroup = document.getElementById('amountGroup');
  // Show amount for cash/dividend
  amountGroup.style.display = (isCash || isDividend || !type) ? '' : 'none';

  const priceGroup = document.getElementById('priceGroup');
  priceGroup.style.display = (isSplit || isCash) ? 'none' : '';
}

document.getElementById('txnType').addEventListener('change', e => updateFormFields(e.target.value));

document.getElementById('txnForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id  = document.getElementById('txnId').value;
  const raw = document.getElementById('txnDate').value;

  const data = {
    date:     raw ? new Date(raw + 'T12:00:00Z').toISOString() : new Date().toISOString(),
    type:     document.getElementById('txnType').value,
    symbol:   document.getElementById('txnSymbol').value.toUpperCase(),
    name:     document.getElementById('txnName').value,
    quantity: parseFloat(document.getElementById('txnQty').value)   || 0,
    price:    parseFloat(document.getElementById('txnPrice').value)  || 0,
    amount:   parseFloat(document.getElementById('txnAmount').value) || 0,
    fees:     parseFloat(document.getElementById('txnFees').value)   || 0,
    currency: document.getElementById('txnCurrency').value,
    notes:    document.getElementById('txnNotes').value,
  };

  try {
    if (id) {
      await updateTransaction(id, data);
      showToast('Transaction updated!');
    } else {
      await createTransaction(data);
      showToast('Transaction added!');
    }
    closeModal();
    await loadAll();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

window.openEdit = async function(id) {
  const txn = state.transactions.find(t => t.id === id);
  if (txn) openModal(txn);
};

window.confirmDelete = async function(id) {
  if (!confirm('Delete this transaction?')) return;
  try {
    await deleteTransaction(id);
    showToast('Transaction deleted!');
    await loadAll();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

/* ══════════════════════════════════════════════════════════════
   Stock search (topbar)
══════════════════════════════════════════════════════════════ */
function buildSearchDropdown(results, dropdownEl, onSelect) {
  if (!results.length) {
    dropdownEl.innerHTML = '<li class="muted" style="padding:12px 14px;">No results</li>';
  } else {
    dropdownEl.innerHTML = results.map(r => `
      <li data-symbol="${r.symbol}" data-name="${r.long_name || r.short_name}">
        <span class="sym">${r.symbol}</span>
        <span class="name">${r.long_name || r.short_name}</span>
      </li>`).join('');
    dropdownEl.querySelectorAll('li[data-symbol]').forEach(li => {
      li.addEventListener('click', () => {
        onSelect(li.dataset.symbol, li.dataset.name);
        dropdownEl.classList.add('hidden');
      });
    });
  }
  dropdownEl.classList.remove('hidden');
}

let searchDebounce;
document.getElementById('stockSearch').addEventListener('input', function () {
  clearTimeout(searchDebounce);
  const q = this.value.trim();
  const dd = document.getElementById('searchResults');
  if (!q) { dd.classList.add('hidden'); return; }
  searchDebounce = setTimeout(async () => {
    try {
      const results = await searchStocks(q);
      buildSearchDropdown(results, dd, (symbol) => {
        this.value = '';
        // Navigate to a quote view – for now just show a toast with quote info
        getQuote(symbol).then(q => {
          showToast(`${symbol}: ${fmtMoney(q.price, q.currency)}  ${fmtPct(q.change_pct)}`);
        }).catch(() => {});
      });
    } catch { dd.classList.add('hidden'); }
  }, 350);
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrapper')) {
    document.getElementById('searchResults').classList.add('hidden');
  }
  if (!e.target.closest('.symbol-input-wrap')) {
    document.getElementById('modalSearchResults').classList.add('hidden');
  }
});

// Symbol search inside modal
let modalSearchDebounce;
document.getElementById('txnSymbol').addEventListener('input', function () {
  clearTimeout(modalSearchDebounce);
  const q = this.value.trim();
  const dd = document.getElementById('modalSearchResults');
  if (q.length < 2) { dd.classList.add('hidden'); return; }
  modalSearchDebounce = setTimeout(async () => {
    try {
      const results = await searchStocks(q);
      buildSearchDropdown(results, dd, (symbol, name) => {
        document.getElementById('txnSymbol').value = symbol;
        document.getElementById('txnName').value   = name;
        // Pre-fill price if this is a buy/sell
        const type = document.getElementById('txnType').value;
        if (['buy', 'sell'].includes(type)) {
          getQuote(symbol).then(q => {
            document.getElementById('txnPrice').value = q.price.toFixed(2);
            if (!document.getElementById('txnCurrency').value) {
              document.getElementById('txnCurrency').value = q.currency || 'USD';
            }
          }).catch(() => {});
        }
      });
    } catch { dd.classList.add('hidden'); }
  }, 350);
});

/* ══════════════════════════════════════════════════════════════
   Data loading
══════════════════════════════════════════════════════════════ */
async function loadAll() {
  try {
    const [portfolio, transactions, chartData] = await Promise.all([
      fetchPortfolio(),
      fetchTransactions(),
      fetchCharts(),
    ]);

    state.portfolio     = portfolio;
    state.transactions  = transactions || [];

    renderDashboard();
    renderPerformanceChart(chartData);
    renderTransactionsPage();

    // Re-render current page if not dashboard
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-holdings') renderHoldingsPage();
    if (activePage && activePage.id === 'page-analytics') renderAnalyticsPage();
  } catch (err) {
    console.error('Failed to load data:', err);
    showToast('Failed to load portfolio data', 'error');
  }
}

/* ══════════════════════════════════════════════════════════════
   Theme
══════════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeIcon').className =
    theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  localStorage.setItem('theme', theme);
  // Re-render charts with new theme colors
  renderAllocationChart();
  if (state.charts.performance) {
    fetchCharts().then(data => renderPerformanceChart(data)).catch(() => {});
  }
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});

/* ══════════════════════════════════════════════════════════════
   Event wiring
══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

// "View all" links
document.querySelectorAll('[data-page]').forEach(el => {
  if (el.tagName === 'A') {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  }
});

document.getElementById('addTxnBtn').addEventListener('click', () => openModal());
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

document.getElementById('refreshHoldings').addEventListener('click', async () => {
  showToast('Refreshing prices…');
  await loadAll();
  renderHoldingsPage();
  showToast('Prices refreshed!');
});

document.getElementById('filterType').addEventListener('change', async function () {
  try {
    state.transactions = (await fetchTransactions(this.value)) || [];
    renderTransactionsPage();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

/* ══════════════════════════════════════════════════════════════
   Bootstrap
══════════════════════════════════════════════════════════════ */
(function init() {
  // Apply saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('themeIcon').className =
    savedTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';

  loadAll();
})();
