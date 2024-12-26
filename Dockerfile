# Use Node.js 18 Alpine image
FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache openssl

# Set the working directory inside the container
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy only package files to leverage Docker's layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including TailwindCSS and PostCSS if needed)
RUN npm ci && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the desired port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "docker-start"]
