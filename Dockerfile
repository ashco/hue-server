FROM node:12

WORKDIR ./

# copy this over before rest of files so if changes occur, packages can be updated and reinstalled.
COPY package*.json ./
RUN npm install
# otherwise, copy over new project files and don't worry about updating packages.
COPY . .

ENV PORT=9000

EXPOSE 9000

CMD [ "npm", "start" ]