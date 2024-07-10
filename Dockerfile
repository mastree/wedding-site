# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g @angular/cli@latest

COPY . .

RUN ng build --configuration production


FROM nginx:latest

COPY --from=build /app/dist/wedding-site/browser /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# ADD conf.d /etc/nginx/conf.d
