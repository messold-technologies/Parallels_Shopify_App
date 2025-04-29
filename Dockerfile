FROM node:18-alpine

# Install system deps
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy dependency files first to optimize cache
COPY package.json package-lock.json* ./

# Install all dependencies (tailwindcss must be in dependencies)
RUN npm ci

# Copy rest of the application
COPY . .

# Build the app (needs tailwind, postcss, etc.)
RUN npm run build

# Prune dev dependencies AFTER build
RUN npm prune --omit=dev && \
    npm remove @shopify/cli && \
    npm cache clean --force

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "docker-start"]
