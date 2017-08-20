#!/bin/bash

cd $( dirname $( readlink -f $0 ))/../

[ -z "$1" ] && {
    echo "search word not provided."
    exit 1
}
[ -z "$2" ] && {
    echo "replace word not provided."
    exit 1
}

files=$( find -type f -iname "*.js" |\
    grep -v -e "node_modules" -e "d3-wb-release" \
-e "d3-wb-server" -e "d3-wb/libs" -e "_release" )

echo -e "-- hits\n"
echo $files | tr " " "\n" | while read file
do
    [ -z "$( cat $file | grep "$1" )" ] && continue
    [ ! -z $( command -v tput) ] && {
        echo "$( tput setaf 1 )-- $file$( tput sgr0 )"
    } || {
        echo "-- $file"
    }
    cat $file | grep "$1"
done

echo
read -p "-- proceed? (y/n)" -n 1 -r
[[ ! $REPLY =~ ^[Yy]$ ]] && { echo ""; exit 1; }
echo ""

echo $files | while read srcfile; do sed -i -e "s/$1/$2/g" $srcfile; done
