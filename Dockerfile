# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .

# install dependencies, lockfile
RUN yarn install --production --frozen-lockfile

COPY . .

RUN yarn prisma generate

# build app
RUN yarn build

EXPOSE 3000

CMD yarn serve