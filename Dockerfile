FROM node:18.17-alpine AS builder

# Install necessary build dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies with production flag false to ensure dev dependencies are installed
RUN npm ci --production=false

# Copy all application files
COPY . .

# Generate Prisma Client before build
RUN npx prisma generate

# Build with additional memory allocated
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Production stage
FROM node:18.17-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package files
COPY --from=builder /app/package.json /app/package-lock.json* ./

# Install production dependencies only
RUN npm ci --only=production

# Copy necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Generate Prisma Client for production
RUN npx prisma generate

EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]