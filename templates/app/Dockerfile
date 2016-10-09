FROM node:6

# RUN npm cache clean -f; npm install -g yo

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_PATH=/usr/local/lib/node_modules/:/usr/local/lib  NODE_ENV=production

COPY *.json /usr/src/app/
RUN npm install 
COPY ./dist/ /usr/src/app/

CMD [ "npm", "start" ]

EXPOSE 8080
