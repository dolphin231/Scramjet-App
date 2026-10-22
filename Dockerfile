FROM node:18-alpine

ENV NODE_ENV=production

EXPOSE 8080/tcp

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy the rest of the code
COPY . .

CMD ["node", "src/index.js"]
