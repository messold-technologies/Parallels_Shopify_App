FROM node:18-alpine

RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./

# Install dependencies and Tailwind explicitly
RUN npm ci && \
    npm install tailwindcss postcss autoprefixer && \
    npm cache clean --force

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "docker-start"]