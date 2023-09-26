FROM node:lts
WORKDIR /Andcrowd-Frontend/andcrowd/
COPY package.json ./
COPY . /Andcrowd-Frontend/andcrowd/
RUN npm install
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
