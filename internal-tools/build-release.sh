#!/bin/bash

cd $( dirname $( readlink -f $0 ))/../

[ "$1" == "-f" ] && force=1 || force=0

echo "-- preparing environment..."
[ -z $( command -v uglifyjs ) ] && sudo npm install -g uglify-es
[ ! -z "$( git diff-index --name-only HEAD -- )" ] && [ $force -eq 0 ] && {
    echo "You have uncommitted changes."
    echo "Will abort unless running with '-f' force-option."
    exit 1
}

echo "-- creating version string"
curr_module_version=$( head -n5 package.json | grep version |\
awk '{print $2}' | tr -d "\"" | tr -d , )
curr_commit_hash=$( git rev-parse --short HEAD )
curr_ver="${curr_module_version}.${curr_commit_hash}"
echo "-- version is: ${curr_ver}"
tdir="d3-wb-releases/${curr_ver}"
mkdir -p $tdir

infiles=$(
{
find ./d3-wb/libs -type f -iname "*.js" | grep -v "d3.js" | sort
echo ./d3-wb/d3-wb.js
find ./d3-wb/*.js -maxdepth 1 | grep -v "d3-wb.js" | sort
find ./d3-wb/reusable-charts/*.js  -maxdepth 1
} | tr "\n" " "
)
infiles_wd3="./d3-wb/libs/d3/d3.js $infiles"

echo -e "-- input-files: \n\n$( echo $infiles | tr " " "\n" )\n"

echo "-- packing human-readable js..."
cat $infiles > ${tdir}/d3-wb.js
cat $infiles_wd3 > ${tdir}/d3-wb.icld3.js

echo "-- uglifying human-readable js..."
uglifyjs --compress --mangle -- $infiles > ${tdir}/d3-wb.min.js
uglifyjs --compress --mangle -- $infiles_wd3 > ${tdir}/d3-wb.icld3.min.js

echo -e "-- result:\n"

before_bytes=$( wc -c ${tdir}/d3-wb.js |\
tail -n1 | cut -d" " -f1 )
after_bytes=$( wc -c ${tdir}/d3-wb.min.js |\
tail -n1 | cut -d" " -f1 )
echo "d3-wb:  $before_bytes > $after_bytes bytes (-$( echo "scale=2;(1-$after_bytes/$before_bytes)*100" | bc )%)"

before_bytes=$( wc -c ${tdir}/d3-wb.icld3.js |\
tail -n1 | cut -d" " -f1 )
after_bytes=$( wc -c ${tdir}/d3-wb.icld3.min.js |\
tail -n1 | cut -d" " -f1 )
echo "d3-wb.icld3:  $before_bytes > $after_bytes bytes (-$( echo "scale=2;(1-$after_bytes/$before_bytes)*100" | bc )%)"

echo
