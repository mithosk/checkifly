FROM node:22.11.0-alpine
WORKDIR /project
COPY . .
RUN npm install
RUN npm run build
RUN rm -rf src
RUN rm -rf node_modules
RUN npm install --omit=dev
CMD [ "npm", "start" ]