FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install esbuild@latest

RUN npm i -g serve

COPY . .

RUN npm run build --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
# CMD [ "serve", "-s", "dist" ]