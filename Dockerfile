FROM node:18-alpine

RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies first
COPY package*.json ./
RUN npm ci

# Then install build dependencies temporarily
RUN npm install -D tailwindcss postcss autoprefixer

COPY . .
RUN npm run build && \
    npm prune --production

EXPOSE 3000
CMD ["npm", "run", "docker-start"]