FROM node:20.11.1-bullseye
WORKDIR /app
ENV PORT 3000
COPY . .
RUN npm install
EXPOSE 5000
CMD [ "npm", "run", "start"]