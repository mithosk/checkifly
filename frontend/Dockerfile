FROM node:22.12.0-alpine
WORKDIR /project
COPY . .
RUN truncate -s 0 .env
ARG BACKEND_URL
RUN echo "NEXT_PUBLIC_BACKEND_URL=${BACKEND_URL}" >> .env
RUN npm install
RUN npm run build
RUN rm -rf src
RUN rm -rf node_modules
RUN npm install --omit=dev
CMD [ "npm", "start" ]