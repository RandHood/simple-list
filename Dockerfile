FROM node:14

# ADD start.sh /
# RUN /start.sh

# CMD ["./start.sh"]
# CMD ["node", "./cors-anywhere/server.js", "&", "npm", "start"]


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY /cors-anywhere/package*.json ./
RUN npm install
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

CMD node ./cors-anywhere/server.js & npm start
# CMD ["node", "./cors-anywhere/server.js", "&", "npm", "start"]