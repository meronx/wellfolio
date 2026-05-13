# Wellfolio

A responsive financial investment tracking web application built with Go, featuring a modern dark-mode UI.

## Features

- **Transaction types**: Buy, Sell, Split, Dividend, Interest Earning, Tax, Withdrawal, Deposit
- **Live market data**: Stock prices and holding details pulled from Yahoo Finance
- **Portfolio dashboard**: Total value, unrealized/realized P&L, day change, cash balance
- **Charts**: Portfolio allocation (donut), invested capital over time (line), monthly dividends (bar), transaction type breakdown (pie)
- **Holdings view**: Real-time prices, average cost, weight, 52-week range
- **Analytics**: Income, taxes, deposits/withdrawals breakdown
- **Dark / Light mode** toggle
- **Responsive** – works on desktop and mobile

## Quick Start (Docker)

```bash
docker compose up -d
```

Then open **http://localhost:8080** in your browser.

## Run locally

```bash
go run .
```

The server listens on port `8080` by default (override with `PORT` env var).

## Environment variables

| Variable   | Default           | Description                          |
|------------|-------------------|--------------------------------------|
| `DB_PATH`  | `wellfolio.db`    | Path to the SQLite database file     |
| `PORT`     | `8080`            | HTTP server port                     |
| `GIN_MODE` | `release`         | Set to `debug` for verbose logging   |

## Tech stack

- **Backend**: Go 1.22, [Gin](https://github.com/gin-gonic/gin), [GORM](https://gorm.io), SQLite (pure-Go via [glebarez/sqlite](https://github.com/glebarez/sqlite))
- **Market data**: Yahoo Finance (via direct API calls)
- **Frontend**: Vanilla JS SPA, [Chart.js](https://www.chartjs.org/), Font Awesome
- **Container**: Multi-stage Docker build (scratch final image)
