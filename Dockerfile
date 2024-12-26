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

# Install only production dependencies and clean up cache
RUN npm ci --omit=dev && npm cache clean --force

# Remove Shopify CLI packages (if you really don't need them in production)
RUN npm remove @shopify/cli

# Copy the rest of the application code
COPY . .

# **Install TailwindCSS and PostCSS Dependencies** in the production build if needed
RUN npm install tailwindcss postcss autoprefixer --omit=dev

# Build the application
RUN npm run build

# Expose the desired port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "docker-start"]
