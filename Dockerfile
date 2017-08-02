FROM ubuntu:16.04
LABEL version="1.0"
LABEL description="d3-workbench node.js environment."

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get upgrade -y
RUN apt-get install -y nodejs nodejs-legacy npm x11-apps gtk3.0 libxss1 gconf2 libnss3 libcanberra-gtk-module

RUN mkdir /workdir

COPY default-content/ /workdir/default-content
COPY d3-wb/ /workdir/d3-wb
COPY d3-wb-server/ /workdir/d3-wb-server

COPY package.json /workdir
COPY d3-wb-server.js /workdir
COPY default-content-auth.json /workdir

WORKDIR /workdir
RUN npm install
EXPOSE 50321

ENTRYPOINT node d3-wb-server.js
