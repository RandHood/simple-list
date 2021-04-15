FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY ./cors-anywhere/package*.json ./cors-anywhere/
RUN npm --prefix ./cors-anywhere install ./cors-anywhere

# Bundle app source
COPY . .

# Install cors-anywhere dependencies
# COPY ./cors-anywhere/package*.json ./
# RUN npm install

EXPOSE 8080

CMD ./start.sh
# CMD node ./cors-anywhere/server.js & npm start