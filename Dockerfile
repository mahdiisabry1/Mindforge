FROM node:22-alpine3.20 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
ENV NEXT_DISABLE_ESLINT=1 
RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start"]
