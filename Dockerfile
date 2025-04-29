FROM node:18-alpine

# Install system deps
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy dependency files first to optimize cache
COPY package.json package-lock.json* ./

# ⛔ Temporarily unset NODE_ENV to install all deps
# Set environment (moved AFTER npm install)
# COPY and install ALL dependencies
RUN npm ci --include=dev

# Set environment (now it's safe)
ENV NODE_ENV=production

# Copy rest of the application
COPY . .

# Build the app
RUN npm run build

# Prune dev dependencies AFTER build
RUN npm prune --omit=dev && \
    npm remove @shopify/cli && \
    npm cache clean --force

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "docker-start"]
