FROM node:18

WORKDIR /yanua/frontend/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ["package.json", "package-lock.json", "./"]
 
RUN npm install
 
COPY . .
 
EXPOSE 8083
 
CMD [ "npm", "start" ]

