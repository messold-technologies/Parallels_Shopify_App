FROM node:18-alpine

# Install system packages
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install all dependencies including dev (needed for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# Prune devDependencies and clean up
RUN npm prune --omit=dev && \
    npm remove @shopify/cli && \
    npm cache clean --force

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "docker-start"]
