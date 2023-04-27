# builder
FROM node:lts-slim as builder

WORKDIR /build

COPY package*.json /build/

RUN npm ci

COPY . /build/

RUN npm run build

# Runner
FROM node:lts-slim

WORKDIR /app

# Don't copy node_modules. It might be slower, but we don't need dev packages in production.
COPY --from=builder /build/package*.json /app/
RUN npm ci --only=production
COPY --from=builder /build/dist/ /app/dist/

CMD ["node", "--unhandled-rejections=strict", "dist/server/backend_bundle.js"]
