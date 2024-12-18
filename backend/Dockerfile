FROM node:22.12.0-alpine
WORKDIR /project
COPY . .
RUN rm .env
RUN npm install
RUN npm run test
RUN rm -rf coverage
RUN npm run build
RUN rm -rf src
RUN rm -rf node_modules
RUN npm install --omit=dev
CMD [ "npm", "start" ]