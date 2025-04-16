ARG NODE_VERSION=22.0.0
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

# removed this since it didn't work with the pipeline that publishes
# to Digital Ocean
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
#RUN --mount=type=bind,source=package.json,target=package.json \
#    --mount=type=bind,source=package-lock.json,target=package-lock.json \
#    --mount=type=cache,target=/root/.npm \
#    npm ci --omit=dev

# Run the application as a non-root user.
USER node


COPY . .

EXPOSE 8080
CMD ["npm", "start"]
