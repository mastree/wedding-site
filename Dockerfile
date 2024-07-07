# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration production
# ENTRYPOINT ["node", "dist/wedding-site/server/server.mjs"]


FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci

COPY --from=build /app/dist ./dist
# Run the application as a non-root user.
USER node
ENTRYPOINT ["node", "dist/wedding-site/server/server.mjs"]
