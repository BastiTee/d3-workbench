#!/bin/bash

function recho() {
    [ -z $( command -v tput ) ] && {
        echo $@
    } || {
        echo "$( tput setaf 1)$@$( tput sgr0 )"
    }
}
function becho() {
    [ -z $( command -v tput ) ] && {
        echo $@
    } || {
        echo "$( tput setaf 2)$@$( tput sgr0 )"
    }
}

cd $( dirname $( readlink -f $0 ))/../

[ "$1" == "-f" ] && force=1 || force=0

recho "-- preparing environment"
[ -z $( command -v uglifyjs ) ] && sudo npm install -g uglify-es

recho "-- checking git status"
[ ! -z "$( git diff-index --name-only HEAD -- )" ] && [ $force -eq 0 ] && {
    echo "You have uncommitted changes."
    echo "Will abort unless running with '-f' force-option."
    exit 1
}

recho "-- creating version string"
curr_module_version=$( head -n5 package.json | grep version |\
awk '{print $2}' | tr -d "\"" | tr -d , )
curr_commit_hash=$( git rev-parse --short HEAD )
curr_ver="${curr_module_version}.${curr_commit_hash}"
echo "   > ${curr_ver}"
tdir="d3-wb-releases/${curr_ver}"

recho "-- creating target directory"
rm -rfv $tdir
mkdir -pv $tdir

recho "-- packing releases"

function release() {
    tfile=$1
    shift
    echo -e "   > input-files: $@"

    echo "   > packing human-readable js"
    for file in $@; do cat $file; echo; done > ${tdir}/${tfile}.js

    echo "   > uglifying human-readable js"
    uglifyjs --compress --mangle -- $@ > ${tdir}/${tfile}.min.js

    before_bytes=$( wc -c ${tdir}/${tfile}.js |\
    tail -n1 | cut -d" " -f1 )
    after_bytes=$( wc -c ${tdir}/${tfile}.min.js |\
    tail -n1 | cut -d" " -f1 )
    echo "   > result: ${tfile}:  $before_bytes > $after_bytes bytes (-$( echo "scale=2;(1-$after_bytes/$before_bytes)*100" | bc )%)"

    echo
}

# ---------------------------------------------------------------------------
becho "   > WORKBENCH STANDALONE"
infiles=$(
{
echo ./d3-wb/d3-wb.js
} | tr "\n" " "
)
release "d3-wb.solo" $infiles
# ---------------------------------------------------------------------------
becho "   > PLUGINS STANDALONE"
infiles=$(
{
find ./d3-wb/d3-wb-plugins/*.js -maxdepth 1 | sort
} | tr "\n" " "
)
release "d3-wb-plugins.solo" $infiles
# ---------------------------------------------------------------------------
becho "   > REUSABLE CHARTS STANDALONE"
infiles=$(
{
find ./d3-wb/d3-wb-reusable-charts/*.js -maxdepth 1 | sort
} | tr "\n" " "
)
release "d3-wb-reusable-charts.solo" $infiles
# ---------------------------------------------------------------------------
becho "   > D3 PLUGINS STANDALONE"
infiles=$(
{
find ./d3-wb/d3-plugins/*/*.js -maxdepth 1 | sort
} | tr "\n" " "
)
release "d3-wb-d3-plugins.solo" $infiles
# ---------------------------------------------------------------------------
becho "   > WORKBENCH + PLUGINS"
infiles=$(
{
echo ./d3-wb/d3-wb.js
find ./d3-wb/d3-wb-plugins/*.js -maxdepth 1 | sort
} | tr "\n" " "
)
release "d3-wb+plugins" $infiles
# ---------------------------------------------------------------------------
becho "   > WORKBENCH + PLUGINS + REUSABLE CHARTS (= ALL WITHOUT D3)"
infiles=$(
{
find ./d3-wb/d3-plugins/*/*.js -maxdepth 1 | sort
echo ./d3-wb/d3-wb.js
find ./d3-wb/d3-wb-plugins/*.js -maxdepth 1 | sort
find ./d3-wb/d3-wb-reusable-charts/*.js -maxdepth 1 | sort
} | tr "\n" " "
)
release "d3-wb.no-d3" $infiles
# ---------------------------------------------------------------------------
becho "   > ALL"
infiles=$(
{
echo ./d3-wb/d3/d3.js
find ./d3-wb/d3-plugins/*/*.js -maxdepth 1 | sort
echo ./d3-wb/d3-wb.js
find ./d3-wb/d3-wb-plugins/*.js -maxdepth 1 | sort
find ./d3-wb/d3-wb-reusable-charts/*.js -maxdepth 1 | sort
} | tr "\n" " "
)
release "d3-wb" $infiles

# ---------------------------------------------------------------------------
recho "-- finshed"
find $tdir -type f | sort
