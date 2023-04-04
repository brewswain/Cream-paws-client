FROM node:16.17.0
WORKDIR /app

COPY package.json .


# RUN npm install --only=prod
RUN npm --global config set user root && \
    npm --global install @expo/ngrok
RUN npm install
# RUN npm install --only=prod 


COPY . .

CMD ["npm", "start"]