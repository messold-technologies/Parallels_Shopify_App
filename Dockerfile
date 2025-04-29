FROM node:18-alpine AS builder

# Install necessary build dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies with explicit environment
ENV NODE_ENV=development
RUN npm ci

# Copy all application files
COPY . .

# Generate Prisma Client before build
ENV DATABASE_URL="dummy_url_for_prisma_generate"
RUN npx prisma generate

# Add verbose logging for build step
RUN npm run build || (echo "Build failed!" && npm run build --verbose && exit 1)

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files and directories from build stage
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Generate Prisma Client for production
RUN npx prisma generate

EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]