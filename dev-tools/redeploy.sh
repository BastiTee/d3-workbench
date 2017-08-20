#!/bin/bash

cd $( dirname $( readlink -f $0 ))/../

sudo /etc/init.d/d3-workbench stop
git pull
npm install
sudo /etc/init.d/d3-workbench start

