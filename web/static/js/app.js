'use strict';

/* ══════════════════════════════════════════════════════════════
   State
══════════════════════════════════════════════════════════════ */
const state = {
  portfolio: null,
  transactions: [],
  charts: {
    allocation: null, performance: null,
    dividends: null, typeChart: null,
    stockPrice: null, stockVolume: null,
  },
  stockChart: { symbol: null, period: '1mo' },
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
const fmtDateShort = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function sign(v) {
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

function fmtVolume(v) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return String(v);
}

/* ══════════════════════════════════════════════════════════════
   Chart.js helpers
══════════════════════════════════════════════════════════════ */
function chartTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  return {
    isDark,
    text:    isDark ? '#8b949e' : '#656d76',
    grid:    isDark ? 'rgba(48,54,61,.5)' : 'rgba(208,215,222,.5)',
    surface: isDark ? '#161b22' : '#ffffff',
  };
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

const fetchPortfolio    = () => api('/api/portfolio');
const fetchTransactions = (type = '') => api(`/api/transactions${type ? `?type=${type}` : ''}`);
const fetchCharts       = () => api('/api/charts');
const searchStocks      = q => api(`/api/search?q=${encodeURIComponent(q)}`);
const getQuote          = sym => api(`/api/quote/${encodeURIComponent(sym)}`);
const getHistory        = (sym, period) => api(`/api/history/${encodeURIComponent(sym)}?period=${period}`);
const getDividendCal    = () => api('/api/dividend-calendar');

const createTransaction = data => api('/api/transactions', { method: 'POST', body: JSON.stringify(data) });
const updateTransaction = (id, data) => api(`/api/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
const deleteTransaction = id => api(`/api/transactions/${id}`, { method: 'DELETE' });

/* ══════════════════════════════════════════════════════════════
   Navigation
══════════════════════════════════════════════════════════════ */
const pages = {
  dashboard:    document.getElementById('page-dashboard'),
  holdings:     document.getElementById('page-holdings'),
  transactions: document.getElementById('page-transactions'),
  calendar:     document.getElementById('page-calendar'),
  analytics:    document.getElementById('page-analytics'),
};

const pageTitles = {
  dashboard: 'Dashboard', holdings: 'Holdings',
  transactions: 'Transactions', calendar: 'Dividend Calendar', analytics: 'Analytics',
};

function navigateTo(page) {
  if (!pages[page]) return;
  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[page].classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
  document.getElementById('pageTitle').textContent = pageTitles[page] || page;

  closeSidebar();

  if (page === 'holdings')     renderHoldingsPage();
  if (page === 'analytics')    renderAnalyticsPage();
  if (page === 'calendar')     renderCalendarPage();
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
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
    const th = chartTheme();
    const labels = p.holdings.map(h => h.symbol);
    const data   = p.holdings.map(h => h.current_value || h.total_cost);
    const colors = p.holdings.map((_, i) => palette[i % palette.length]);

    state.charts.allocation = new Chart(canvas, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: th.surface }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: th.text, padding: 12, font: { size: 12 } } },
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

    const th = chartTheme();

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
          legend: { labels: { color: th.text } },
          tooltip: { callbacks: { label: ctx => ` ${fmtMoney(ctx.parsed.y)}` } },
        },
        scales: {
          x: { ticks: { color: th.text, maxRotation: 0, maxTicksLimit: 8 }, grid: { color: th.grid } },
          y: { ticks: { color: th.text, callback: v => fmtMoney(v) }, grid: { color: th.grid } },
        },
      },
    });
  } catch (e) { console.error('Performance chart error:', e); }
}

/* ══════════════════════════════════════════════════════════════
   Advanced Stock Price Chart
══════════════════════════════════════════════════════════════ */
function calcMA(data, window) {
  return data.map((_, i) => {
    if (i < window - 1) return null;
    const slice = data.slice(i - window + 1, i + 1);
    const valid = slice.filter(v => v !== null);
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  });
}

async function loadStockChart(symbol, period) {
  if (!symbol) return;
  state.stockChart.symbol = symbol;
  state.stockChart.period = period;

  const infoEl = document.getElementById('stockChartInfo');
  infoEl.innerHTML = `<span class="muted">Loading ${symbol}…</span>`;

  try {
    const [points, quote] = await Promise.all([
      getHistory(symbol, period),
      getQuote(symbol).catch(() => null),
    ]);

    if (!points || points.length === 0) {
      infoEl.innerHTML = `<span class="muted">No data for ${symbol}</span>`;
      return;
    }

    // Update info bar
    if (quote) {
      const chgCls = quote.change_pct >= 0 ? 'positive' : 'negative';
      infoEl.innerHTML = `
        <div class="stock-info-item"><div class="stock-info-label">Symbol</div><div class="stock-info-value">${quote.symbol}</div></div>
        <div class="stock-info-item"><div class="stock-info-label">Price</div><div class="stock-info-value">${fmtMoney(quote.price, quote.currency)}</div></div>
        <div class="stock-info-item"><div class="stock-info-label">Change</div><div class="stock-info-value ${chgCls}">${fmtPct(quote.change_pct)}</div></div>
        <div class="stock-info-item"><div class="stock-info-label">Vol</div><div class="stock-info-value">${fmtVolume(quote.volume)}</div></div>
        <div class="stock-info-item"><div class="stock-info-label">52W H</div><div class="stock-info-value">${fmtMoney(quote.fifty_two_week_high, quote.currency)}</div></div>
        <div class="stock-info-item"><div class="stock-info-label">52W L</div><div class="stock-info-value">${fmtMoney(quote.fifty_two_week_low, quote.currency)}</div></div>
      `;
    } else {
      infoEl.innerHTML = `<span class="muted">${symbol}</span>`;
    }

    const labels  = points.map(p => p.date);
    const closes  = points.map(p => p.close);
    const highs   = points.map(p => p.high);
    const lows    = points.map(p => p.low);
    const volumes = points.map(p => p.volume);

    const ma20 = calcMA(closes, 20);
    const ma50 = calcMA(closes, 50);
    const th = chartTheme();

    // Determine overall trend for gradient color
    const firstClose = closes.find(v => v != null) || 0;
    const lastClose  = closes[closes.length - 1] || 0;
    const isUp = lastClose >= firstClose;
    const lineColor = isUp ? '#3fb950' : '#f85149';
    const fillColor = isUp ? 'rgba(63,185,80,.12)' : 'rgba(248,81,73,.12)';

    // Price chart
    if (state.charts.stockPrice) state.charts.stockPrice.destroy();
    const priceCanvas = document.getElementById('stockPriceChart');
    state.charts.stockPrice = new Chart(priceCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'High',
            data: highs,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            fill: '+1',
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 0,
          },
          {
            label: 'Low',
            data: lows,
            borderColor: 'transparent',
            backgroundColor: 'rgba(99,102,241,.08)',
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 0,
          },
          {
            label: symbol,
            data: closes,
            borderColor: lineColor,
            backgroundColor: fillColor,
            fill: 'origin',
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 2,
          },
          {
            label: 'MA20',
            data: ma20,
            borderColor: '#d29922',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 1.5,
            borderDash: [4, 3],
          },
          {
            label: 'MA50',
            data: ma50,
            borderColor: '#388bfd',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 1.5,
            borderDash: [6, 4],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: {
              color: th.text,
              filter: item => !['High', 'Low'].includes(item.text),
              padding: 12,
              font: { size: 11 },
            },
          },
          tooltip: {
            callbacks: {
              label: ctx => {
                if (['High', 'Low'].includes(ctx.dataset.label)) return null;
                const v = ctx.parsed.y;
                if (v === null) return null;
                return ` ${ctx.dataset.label}: ${fmtMoney(v)}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: th.text, maxRotation: 0, maxTicksLimit: 8, font: { size: 11 } },
            grid: { color: th.grid },
          },
          y: {
            position: 'right',
            ticks: { color: th.text, callback: v => fmtMoney(v), font: { size: 11 } },
            grid: { color: th.grid },
          },
        },
      },
    });

    // Volume chart
    if (state.charts.stockVolume) state.charts.stockVolume.destroy();
    const volCanvas = document.getElementById('stockVolumeChart');
    const volColors = points.map((p, i) => {
      const prev = i > 0 ? points[i - 1].close : p.open;
      return p.close >= prev ? 'rgba(63,185,80,.6)' : 'rgba(248,81,73,.6)';
    });

    state.charts.stockVolume = new Chart(volCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Volume',
          data: volumes,
          backgroundColor: volColors,
          borderWidth: 0,
          borderRadius: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` Vol: ${fmtVolume(ctx.parsed.y)}` } } },
        scales: {
          x: { display: false, grid: { display: false } },
          y: {
            position: 'right',
            ticks: { color: th.text, callback: v => fmtVolume(v), font: { size: 10 }, maxTicksLimit: 3 },
            grid: { color: th.grid },
          },
        },
      },
    });
  } catch (err) {
    infoEl.innerHTML = `<span class="muted">Error: ${err.message}</span>`;
    console.error('Stock chart error:', err);
  }
}

/* ══════════════════════════════════════════════════════════════
   Recent Transactions (dashboard)
══════════════════════════════════════════════════════════════ */
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

  if (!p.holdings || p.holdings.length === 0) {
    const empty = `<div class="empty-state"><i class="fa-solid fa-briefcase"></i><p>No holdings yet</p></div>`;
    document.getElementById('holdingsTable').innerHTML = empty;
  } else {
    // Desktop table
    document.getElementById('holdingsTable').innerHTML = `
      <div class="holdings-table-wrap">
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
                <td class="muted" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h.name || '–'}</td>
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
        </table>
      </div>
      <div class="holding-cards">
        ${p.holdings.map(h => buildHoldingCard(h)).join('')}
      </div>`;
  }

  setEl('mv-realized',  fmtMoney(p.total_realized_gain), sign(p.total_realized_gain));
  setEl('mv-dividends', fmtMoney(p.total_dividends));
  setEl('mv-interest',  fmtMoney(p.total_interest));
  setEl('mv-fees',      fmtMoney(p.total_fees));
}

function buildHoldingCard(h) {
  const chgCls = h.day_change >= 0 ? 'positive' : 'negative';
  const pnlCls = h.unrealized_gain >= 0 ? 'positive' : 'negative';
  return `
    <div class="holding-card">
      <div class="holding-card-header">
        <div>
          <div class="holding-card-sym">${h.symbol}</div>
          <div class="holding-card-name">${h.name || ''}</div>
        </div>
        <div class="holding-card-price ${chgCls}">
          ${h.current_price ? fmtMoney(h.current_price, h.currency) : '–'}
          <div style="font-size:.75rem;font-weight:500">${h.current_price ? fmtPct(h.day_change_pct) : ''}</div>
        </div>
      </div>
      <div class="holding-card-grid">
        <div class="holding-card-item"><label>Qty</label><span>${fmt(h.quantity, 4)}</span></div>
        <div class="holding-card-item"><label>Avg Cost</label><span>${fmtMoney(h.average_cost, h.currency)}</span></div>
        <div class="holding-card-item"><label>Market Value</label><span>${h.current_value ? fmtMoney(h.current_value, h.currency) : '–'}</span></div>
        <div class="holding-card-item"><label>Unrealized P&L</label><span class="${pnlCls}">${h.current_price ? fmtPct(h.unrealized_gain_pct) : '–'}</span></div>
        <div class="holding-card-item"><label>Weight</label><span>${fmt(h.weight)}%</span></div>
        <div class="holding-card-item"><label>Day Change</label><span class="${chgCls}">${h.current_price ? fmtMoney(h.day_change, h.currency) : '–'}</span></div>
      </div>
    </div>`;
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
            <td class="muted" style="white-space:nowrap">${fmtDate(t.date)}</td>
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
   CSV Export / Import
══════════════════════════════════════════════════════════════ */
document.getElementById('exportCsvBtn').addEventListener('click', () => {
  window.location.href = '/api/transactions/export';
});

document.getElementById('importCsvInput').addEventListener('change', async function () {
  if (!this.files || !this.files[0]) return;
  const file = this.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    const resp = await fetch('/api/transactions/import', { method: 'POST', body: formData });
    if (!resp.ok) {
      const e = await resp.json().catch(() => ({ error: resp.statusText }));
      showToast(e.error || 'Import failed', 'error');
      return;
    }
    const result = await resp.json();
    showToast(`Imported ${result.imported} transaction(s), skipped ${result.skipped}`);
    await loadAll();
  } catch (err) {
    showToast(err.message, 'error');
  }
  this.value = '';
});

/* ══════════════════════════════════════════════════════════════
   Dividend Calendar page
══════════════════════════════════════════════════════════════ */
async function renderCalendarPage() {
  const contentEl  = document.getElementById('calendarContent');
  const upcomingEl = document.getElementById('upcomingDividends');
  contentEl.innerHTML  = `<div class="empty-state"><i class="fa-solid fa-rotate fa-spin"></i><p>Loading…</p></div>`;
  upcomingEl.innerHTML = '';

  try {
    const entries = await getDividendCal();

    if (!entries || entries.length === 0) {
      contentEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-calendar-days"></i><p>No dividend data found.<br>Add dividend transactions or hold dividend-paying stocks.</p></div>`;
      return;
    }

    // Group by year-month
    const byMonth = {};
    entries.forEach(e => {
      const m = e.date.substring(0, 7);
      if (!byMonth[m]) byMonth[m] = [];
      byMonth[m].push(e);
    });

    const months = Object.keys(byMonth).sort();
    const now = new Date();
    const thisMonth = now.toISOString().substring(0, 7);

    // Build month cards
    contentEl.innerHTML = `<div class="calendar-months">${months.map(m => {
      const events = byMonth[m];
      const monthLabel = new Date(m + '-15').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const isCurrentMonth = m === thisMonth;
      return `
        <div class="calendar-month" ${isCurrentMonth ? 'style="border-color:var(--primary)"' : ''}>
          <div class="calendar-month-header" ${isCurrentMonth ? 'style="color:var(--primary)"' : ''}>
            ${monthLabel}${isCurrentMonth ? ' <span style="font-size:.72rem;opacity:.7">(current)</span>' : ''}
          </div>
          <div class="calendar-events">
            ${events.length === 0 ? `<div class="cal-empty">No dividends</div>` :
              events.map(e => `
                <div class="calendar-event">
                  <div class="cal-event-dot ${e.entry_type}"></div>
                  <div class="cal-event-info">
                    <div class="cal-event-sym">${e.symbol}</div>
                    <div class="cal-event-sub">${e.name || ''} ${e.frequency ? `· ${e.frequency}` : ''}</div>
                  </div>
                  <div>
                    <div class="cal-event-amt ${e.entry_type === 'paid' ? 'positive' : ''}">${fmtMoney(e.total_amount)}</div>
                    <div class="cal-event-date">${fmtDateShort(e.date)}</div>
                  </div>
                </div>`).join('')}
          </div>
        </div>`;
    }).join('')}</div>`;

    // Upcoming table (future dividends only)
    const upcoming = entries.filter(e => new Date(e.date) >= now)
                            .sort((a, b) => a.date.localeCompare(b.date))
                            .slice(0, 30);

    if (upcoming.length === 0) {
      upcomingEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-dollar-to-slot"></i><p>No upcoming dividends forecasted</p></div>`;
    } else {
      const totalForecast = upcoming.reduce((s, e) => s + e.total_amount, 0);
      upcomingEl.innerHTML = `
        <table>
          <thead>
            <tr><th>Date</th><th>Symbol</th><th>Name</th><th>Per Share</th><th>Shares</th><th>Est. Amount</th><th>Type</th><th>Frequency</th></tr>
          </thead>
          <tbody>
            ${upcoming.map(e => `
              <tr>
                <td class="muted" style="white-space:nowrap">${fmtDate(e.date)}</td>
                <td><strong class="positive">${e.symbol}</strong></td>
                <td class="muted">${e.name || '–'}</td>
                <td>${e.amount_per_share ? fmtMoney(e.amount_per_share) : '–'}</td>
                <td>${e.shares ? fmt(e.shares, 4) : '–'}</td>
                <td class="${e.entry_type === 'upcoming' ? '' : 'positive'}">${fmtMoney(e.total_amount)}</td>
                <td><span class="badge badge-dividend">${e.entry_type}</span></td>
                <td class="muted">${e.frequency || '–'}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div style="padding:12px 16px;font-size:.85rem;color:var(--text-muted);text-align:right">
          Forecast total (next 12 months): <strong style="color:var(--success)">${fmtMoney(totalForecast)}</strong>
        </div>`;
    }
  } catch (err) {
    contentEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
    console.error('Calendar error:', err);
  }
}

document.getElementById('refreshCalendar').addEventListener('click', renderCalendarPage);

/* ══════════════════════════════════════════════════════════════
   Analytics page
══════════════════════════════════════════════════════════════ */
function renderAnalyticsPage() {
  fetchCharts().then(data => {
    renderDividendsChart(data.dividends);
  }).catch(console.error);

  renderTypeChart();

  const p = state.portfolio;
  if (p) {
    setEl('mv-taxes', fmtMoney(p.total_taxes));
    setEl('mv-income', fmtMoney(p.total_dividends + p.total_interest));

    let deposited = 0, withdrawn = 0;
    state.transactions.forEach(t => {
      if (t.type === 'deposit')    deposited += t.amount;
      if (t.type === 'withdrawal') withdrawn += t.amount;
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
    const th = chartTheme();

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
          legend: { labels: { color: th.text } },
          tooltip: { callbacks: { label: ctx => ` ${fmtMoney(ctx.parsed.y)}` } },
        },
        scales: {
          x: { ticks: { color: th.text }, grid: { color: th.grid } },
          y: { ticks: { color: th.text, callback: v => fmtMoney(v) }, grid: { color: th.grid } },
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
    const th = chartTheme();

    const counts = {};
    state.transactions.forEach(t => { counts[t.type] = (counts[t.type] || 0) + 1; });

    const palette = {
      buy: '#3fb950', sell: '#f85149', split: '#388bfd',
      dividend: '#d29922', interest_earning: '#fbbf24',
      tax: '#fb7185', withdrawal: '#f43f5e', deposit: '#34d399',
    };

    state.charts.typeChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: Object.keys(counts).map(k => k.replace('_', ' ')),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: Object.keys(counts).map(k => palette[k] || '#6366f1'),
          borderWidth: 2,
          borderColor: th.surface,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: th.text, padding: 10, font: { size: 11 } } },
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
    isCash ? 'none' : '';

  document.getElementById('qtyLabel').textContent = isSplit ? 'Split Ratio (e.g. 2)' : 'Quantity';
  document.getElementById('amountLabel').textContent =
    isDividend ? 'Dividend Amount' : (isCash ? 'Amount' : 'Amount (auto)');

  document.getElementById('amountGroup').style.display = (isCash || isDividend || !type) ? '' : 'none';
  document.getElementById('priceGroup').style.display  = (isSplit || isCash) ? 'none' : '';
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
   Stock search
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

// Topbar search
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
    document.getElementById('chartSymbolResults').classList.add('hidden');
  }
  if (!e.target.closest('.symbol-input-wrap')) {
    document.getElementById('modalSearchResults').classList.add('hidden');
  }
});

// Modal symbol search
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

// Chart symbol search
let chartSearchDebounce;
document.getElementById('chartSymbolInput').addEventListener('input', function () {
  clearTimeout(chartSearchDebounce);
  const q = this.value.trim();
  const dd = document.getElementById('chartSymbolResults');
  if (q.length < 1) { dd.classList.add('hidden'); return; }
  chartSearchDebounce = setTimeout(async () => {
    try {
      const results = await searchStocks(q);
      buildSearchDropdown(results, dd, (symbol) => {
        document.getElementById('chartSymbolInput').value = symbol;
        loadStockChart(symbol, state.stockChart.period);
      });
    } catch { dd.classList.add('hidden'); }
  }, 350);
});

document.getElementById('chartSymbolInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const sym = this.value.trim().toUpperCase();
    if (sym) {
      document.getElementById('chartSymbolResults').classList.add('hidden');
      loadStockChart(sym, state.stockChart.period);
    }
  }
});

// Period buttons
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const sym = state.stockChart.symbol || document.getElementById('chartSymbolInput').value.trim().toUpperCase();
    if (sym) loadStockChart(sym, btn.dataset.period);
    state.stockChart.period = btn.dataset.period;
  });
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

    state.portfolio    = portfolio;
    state.transactions = transactions || [];

    renderDashboard();
    renderPerformanceChart(chartData);
    renderTransactionsPage();

    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-holdings')  renderHoldingsPage();
    if (activePage && activePage.id === 'page-analytics') renderAnalyticsPage();
    if (activePage && activePage.id === 'page-calendar')  renderCalendarPage();

    // Auto-load stock chart for the first holding
    if (!state.stockChart.symbol && portfolio && portfolio.holdings && portfolio.holdings.length > 0) {
      const sym = portfolio.holdings[0].symbol;
      document.getElementById('chartSymbolInput').value = sym;
      loadStockChart(sym, state.stockChart.period);
    }
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
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  icon.className  = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  label.textContent = theme === 'dark' ? 'Dark mode' : 'Light mode';
  localStorage.setItem('theme', theme);

  renderAllocationChart();
  if (state.charts.performance) {
    fetchCharts().then(data => renderPerformanceChart(data)).catch(() => {});
  }
  if (state.stockChart.symbol) {
    loadStockChart(state.stockChart.symbol, state.stockChart.period);
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
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
});

document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

/* ══════════════════════════════════════════════════════════════
   Bootstrap
══════════════════════════════════════════════════════════════ */
(function init() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  icon.className    = savedTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  label.textContent = savedTheme === 'dark' ? 'Dark mode' : 'Light mode';

  loadAll();
})();
