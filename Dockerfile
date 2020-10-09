FROM node:12

WORKDIR /app
# copy this over before rest of files so if changes occur, packages can be updated and reinstalled
COPY ["package*.json", "yarn.lock", "./"]
RUN yarn install
# now copy over rest of project files and don't worry about updating packages
COPY . .

ENV NODE_ENV=production
EXPOSE ${PORT}

CMD [ "npm", "start" ]