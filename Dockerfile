# This is a text file that will define all of the Docker instructions necessary for Docker Engine to build an image of my Fragments service
# https://docs.docker.com/engine/reference/builder/

# Stage 0: install the base dependencies

# FROM instruction specifies the parent (or base) image to use as a starting point for our own image
# specifying node version 16.15.0 by adding a :tag

FROM node:16.15.0-alpine3.15@sha256:1a9a71ea86aad332aa7740316d4111ee1bd4e890df47d3b5eff3e5bded3b3d10 AS dependencies

LABEL maintainer="Serach Boes <saboes@myseneca.com>"
LABEL description="Fragments node.js microservice"

# Environment variables

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# define and create our app's working directory
# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install


##########################################################################################
# Stage 1: start the service

FROM node:16.15.0-alpine3.15@sha256:1a9a71ea86aad332aa7740316d4111ee1bd4e890df47d3b5eff3e5bded3b3d10 AS build

WORKDIR /app
# Copy the generated dependencies(node_modules/)
COPY --chown=node:node --from=dependencies /app /app
# Copy your server's source code into the image
# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Switch user to node before we run the app
USER node

# ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start the container by running our server
CMD ["node", "src/index.js"]

# We run our service on port 8080
EXPOSE 8080




