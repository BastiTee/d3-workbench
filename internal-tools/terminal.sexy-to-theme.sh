#!/bin/bash
# Create a theme at https://terminal.sexy/
# Export as XShell to a file
# Execute script with filename and theme name

cd $( dirname $( readlink -f $0 ))

{
echo "var themes = {"
find ./themes -type f -iname "*.theme" | sort |\
while read file
do
    name=$( basename $file .theme )
    echo "    $name: {"
    cat $file | grep -v -e "(" -e "]" -e "name0=" -e "^count=" |\
    sed -e "s/^text/foreground/" -e "s/=/: \"#/g" | sort | while read line
    do
        line=$( awk '{print $1" "toupper($2)}' <<< $line )
        echo -e "        $line\"," | sed -r -e "s/([ ]*yellow[^,]+),/\1/"
    done
    echo "    },"
done
echo "}"
} > ./themes/themes.json
cat ./themes/themes.json