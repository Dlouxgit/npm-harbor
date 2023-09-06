ARG NODE_VERSION=node_version
FROM harbor.com/public/pnpm:${NODE_VERSION} as BUILDER
WORKDIR /app
COPY . .
RUN pnpm install 
RUN pnpm build

ARG NODE_VERSION=node_version
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
COPY --from=builder /app  /app
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
