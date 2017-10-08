# This image will be based on the official nodejs docker image
FROM node:latest

# Set in what directory commands will run
WORKDIR /home/crs/app
ADD . /home/crs/app

# Install dependencies
RUN set -uex ;\
    cd $(npm root -g)/npm \
     && npm install fs-extra \
     && sed -i -e s/graceful-fs/fs-extra/ -e s/fs\.rename/fs.move/ ./lib/utils/rename.js && \
    npm install -g --unsafe-perm angular-cli && \
    cd /home/crs/app && \
    npm install

# The command to run our app when the container is run
VOLUME ["/home/crs/app"]
CMD ["npm", "run-script", "start"]
