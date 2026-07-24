# =====================
# 1️⃣ Build Stage
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments
ARG MINIO_ENDPOINT
ARG MINIO_PORT
ARG MINIO_USE_SSL
ARG MINIO_ACCESS_KEY
ARG MINIO_SECRET_KEY
ARG MINIO_BUCKET

ARG RAZORPAY_KEY_ID
ARG RAZORPAY_KEY_SECRET

# Make them available during next build
ENV MINIO_ENDPOINT=$MINIO_ENDPOINT
ENV MINIO_PORT=$MINIO_PORT
ENV MINIO_USE_SSL=$MINIO_USE_SSL
ENV MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY
ENV MINIO_SECRET_KEY=$MINIO_SECRET_KEY
ENV MINIO_BUCKET=$MINIO_BUCKET

ENV RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
ENV RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build


# =====================
# 2️⃣ Production Stage
# =====================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy || true; npx prisma db seed || true; npm start"]