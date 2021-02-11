# Use the official image as a parent image.
FROM node:12
# Set the working directory.
WORKDIR /app
# copy this over before rest of files so if changes occur, packages can be updated and reinstalled
COPY ["package*.json", "yarn.lock", "./"]
# Run the command inside your image filesystem.
RUN yarn install
# now copy over rest of project files and don't worry about updating packages
COPY . .

ENV NODE_ENV=production
# ENV USER_ID=${USER_ID}
# Tells Docker that the container is listening to a specific port at runtime
# Can reference specific ENV variables with ${ENV_VAR} syntax. Located in .env file
EXPOSE ${PORT}
# Run the specified command within the container.
CMD [ "npm", "start" ]