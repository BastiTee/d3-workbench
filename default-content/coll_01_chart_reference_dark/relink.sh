#!/bin/bash

cd $( dirname $( readlink -f $0 ))
find . -maxdepth 1 -type l | xargs rm -v
find ../coll_00_chart_reference -mindepth 1 -type d |\
while read dir; do
    ln -vs $dir
done