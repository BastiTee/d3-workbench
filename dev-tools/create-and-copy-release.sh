#!/bin/bash
[ -z "$1" ] && { echo "No target dir provided."; exit 1; }
[ ! -d "$1" ] && { echo "Target dir does not exist."; exit 1; }
trgdir=$( readlink -f "$1" )
cd "$( dirname "$( readlink -f "$0" )" )"
echo "-- target directory: $trgdir"
echo "-- compiling release"
./build-release.sh -f > tmpfile
[ $? != 0 ] && { 
    echo "-------------------"
    cat tmpfile
    echo "-------------------"
    exit 1
}
srclib=$( grep -e "d3-wb.min.js$" tmpfile )
srcdir=$( sed -e "s/\/d3-wb.min.js//g" <<< $srclib )
rm tmpfile
echo "-- created $srclib / $srcdir"
trglib=$( sed -r -e "s/^[^/]+\///g" -e "s/\/.*//g" <<< $srclib )
trglib="${trgdir}/d3-wb.$trglib.min.js"
echo "-- target library: $trglib"
cd ..
cp -v $srclib $trglib
echo "-- cleaning up"
rm -rfv $srcdir

