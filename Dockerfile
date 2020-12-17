# Builder use to install deps & Build the code
FROM node:15.3.0-alpine3.12 as builder

RUN apk add --no-cache git
WORKDIR /app
COPY . .

RUN npm i \
  && node ace build --production \
  && cd build \
  && npm ci --production

# Application Runtime
FROM node:15.3.0-alpine3.12

ENV HOST=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production
ENV ENV_SILENT=true
ENV APP_KEY=
ENV SESSION_DRIVER=cookie
ENV CACHE_VIEWS=true

USER node
WORKDIR /app
COPY --from=builder /app/build .

EXPOSE 8080
CMD ["node", "server.js"]
