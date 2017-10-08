# This image will be based on the official nodejs docker image
FROM node:latest

# Set in what directory commands will run
WORKDIR /home/crs/app
ADD . /home/crs/app

# Install dependencies
RUN cd /home/crs/app && \
    npm install

# The command to run our app when the container is run
VOLUME ["/home/crs/app"]
CMD ["npm", "run-script", "build:dynamic:prod"]
