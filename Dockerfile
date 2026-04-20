# ── Build stage ──────────────────────────────────────────────
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install build dependencies (required by some indirect deps even with pure-Go SQLite)
RUN apk add --no-cache ca-certificates tzdata

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o wellfolio .

# ── Runtime stage ─────────────────────────────────────────────
FROM scratch

# Copy certs and timezone data from builder
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

COPY --from=builder /app/wellfolio /wellfolio

EXPOSE 8080

VOLUME /data

ENV GIN_MODE=release
ENV PORT=8080

ENTRYPOINT ["/wellfolio"]
