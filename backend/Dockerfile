FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src
COPY migrations ./migrations
COPY scripts ./scripts

EXPOSE 3000

CMD ["npm", "run", "dev"]
