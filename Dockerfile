FROM node:12.14.1

WORKDIR /app

COPY package.json .


RUN npm --global config set user root && \
    npm --global install expo-cli@3.11.9
    RUN npm install --only=prod 

COPY . .

CMD ["npm", "start"]