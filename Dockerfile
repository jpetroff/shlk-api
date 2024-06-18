FROM --platform=linux/amd64 node:19

# install pm2.io 

RUN npm install pm2 -g

# make work directory
RUN mkdir -p /home/www/node/node_modules && chown -R node:node /home/www/node

# install nad run npm

WORKDIR /home/www/node

COPY package*.json ./

RUN npm install
RUN npm ci --only=production

COPY --chown=node:node ./dist ./

EXPOSE "8002"
ENV NODE_ENV=production

CMD ["pm2-runtime", "./index.js"]