#!/bin/bash
# ---------------------------------------------------------------------------
# > create a theme at https://terminal.sexy/
# > export in xshell format to a file at
#   <repo>/d3-wb/d3-wb-modules/themes/my-theme-name.xcs
# > run this script
# > copy resulting JSON to d3-wb-theme.js
# ---------------------------------------------------------------------------

cd $( dirname $( readlink -f $0 ))/../

echo "let themes = {"
find d3-wb/d3-wb-modules/themes -type f -iname "*.xcs" | sort |\
while read file
do
    name=$( basename $file .xcs )
    echo "    $name: {"
    cat $file | grep -v -e "(" -e "]" -e "name0=" -e "^count=" |\
    sed -e "s/^text/foreground/" -e "s/=/: \'#/g" | sort | while read line
    do
        line=$( awk '{print $1" "toupper($2)}' <<< $line )
        echo -e "        $line',"
    done
    echo "    },"
done
echo "};"
