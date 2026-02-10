# Builder
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma first
COPY prisma ./prisma

# Install deps
RUN npm install

# Copy rest
COPY . .

# Build
RUN npm run build


# Runner
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
