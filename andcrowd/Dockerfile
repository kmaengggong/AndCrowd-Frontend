FROM node:lts
WORKDIR /Andcrowd-Frontend/andcrowd/
COPY package.json package-lock.json ./
COPY . /Andcrowd-Frontend/andcrowd/
RUN npm update
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
