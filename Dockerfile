FROM node:18-alpine

RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json* ./

# Remove NODE_ENV=production and install all deps
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "docker-start"]