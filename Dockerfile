FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy dependency files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev) to allow build
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Remove devDependencies and unnecessary packages
RUN npm prune --omit=dev && \
    npm remove @shopify/cli && \
    npm cache clean --force

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "docker-start"]
