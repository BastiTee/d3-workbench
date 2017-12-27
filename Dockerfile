# docker build -t d3-workbench .
# docker run -ti --rm -p 50321:50321 d3-workbench

# INSTALL BASE SYSTEM
FROM ubuntu:16.04
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y nodejs nodejs-legacy \
npm x11-apps gtk3.0 libxss1 gconf2 libnss3 \
libcanberra-gtk-module git

# INSTALL BLEEDING EDGE D3-WORKBENCH
RUN git clone https://github.com/BastiTee/d3-workbench.git
WORKDIR d3-workbench
RUN npm install

# SETUP
EXPOSE 50321
ENTRYPOINT ["node"] 
CMD [ "bin/d3-wb-server.js", "-i", "+DEMO", "-nv" ]

