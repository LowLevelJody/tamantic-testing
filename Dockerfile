FROM node:20.11.1-bullseye
WORKDIR /app
COPY . .
RUN npm install
CMD [ "npm", "run", "start"]