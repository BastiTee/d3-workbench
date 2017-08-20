#!/bin/bash

cd "$( dirname "$( readlink -f "$0" )" )/.."
find -type f -name "relink.sh" | while read script
do
    $script
done