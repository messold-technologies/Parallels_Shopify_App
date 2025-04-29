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
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate

# Add Vite configuration for Node.js polyfills
RUN echo 'import { defineConfig } from "vite";\n\
export default defineConfig({\n\
  resolve: {\n\
    alias: {\n\
      crypto: "crypto-browserify",\n\
      stream: "stream-browserify",\n\
      assert: "assert",\n\
      http: "stream-http",\n\
      https: "https-browserify",\n\
      os: "os-browserify",\n\
      url: "url",\n\
    },\n\
  },\n\
  optimizeDeps: {\n\
    esbuildOptions: {\n\
      define: {\n\
        global: "globalThis",\n\
      },\n\
    },\n\
  },\n\
});' > vite.config.js

# Install necessary polyfills
RUN npm install --save-dev crypto-browserify stream-browserify assert \
    stream-http https-browserify os-browserify url buffer process

# Run the build with Node.js compatibility flag
RUN NODE_OPTIONS=--no-warnings npm run build

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package files
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/prisma ./prisma

# Install production dependencies only
RUN npm ci --only=production

# Copy build output and necessary files
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Generate Prisma Client for production
RUN npx prisma generate

EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]