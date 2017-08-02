#!/bin/bash

cd $( dirname $( readlink -f $0 ))/../

[ "$1" == "-f" ] && force=1 || force=0

echo "-- preparing environment..."
sudo npm install -g uglify-es
[ ! -z "$( git diff-index --name-only HEAD -- )" ] && [ $force -eq 0 ] && {
    echo "You have uncommitted changes."
    echo "Will abort unless running with '-f' force-option."
    exit 1
}
mkdir -p _release/

echo "-- creating version string"
curr_module_version=$( head -n5 package.json | grep version |\
awk '{print $2}' | tr -d "\"" | tr -d , )
curr_commit_hash=$( git rev-parse --short HEAD )
curr_ver="${curr_module_version}.${curr_commit_hash}"
echo "-- version is: ${curr_ver}"

infiles=$(
{
find ./d3-wb/libs -type f -iname "*.js" | sort
find ./d3-wb/*.js -maxdepth 1
find ./d3-wb/templates/*.js  -maxdepth 1
} | tr "\n" " "
)

echo -e "-- input-files: \n\n$( echo $infiles | tr " " "\n" )\n"

echo "-- packing human-readable js..."
cat $infiles > _release/d3-wb.${curr_ver}.js

echo "-- uglifying human-readable js..."
uglifyjs --compress --mangle -- $infiles \
> _release/d3-wb.${curr_ver}.min.js

echo -e "-- result:\n"

before_bytes=$( wc -c _release/d3-wb.${curr_ver}.js |\
tail -n1 | cut -d" " -f1 )
after_bytes=$( wc -c _release/d3-wb.${curr_ver}.min.js |\
tail -n1 | cut -d" " -f1 )
echo "js:  $before_bytes > $after_bytes bytes (-$( echo "scale=2;(1-$after_bytes/$before_bytes)*100" | bc )%)"

echo
