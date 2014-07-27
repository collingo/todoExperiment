# DOCKER-VERSION 1.1.2

FROM centos:6.4

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

# Bundle app source
ADD . /src

# Install app dependencies
RUN cd /src; npm install
RUN cd /src; node_modules/.bin/grunt build

EXPOSE  8080

CMD ["node", "/src/server/index.js"]
