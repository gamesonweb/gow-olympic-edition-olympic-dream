FROM node:21.7.3-alpine3.19 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install .

COPY . /app/

RUN npm run build

FROM --platform=arm64 nginx:alpine

COPY --from=build /app/dist /dist
COPY ./nginx.conf /etc/nginx/nginx.conf