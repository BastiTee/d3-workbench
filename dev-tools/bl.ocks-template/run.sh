#!/bin/bash
cd "$( dirname "$( readlink -f "$0" )" )"
PORT=8008
[ -z $( command -v python3 ) ] && {
    python -m SimpleHTTPServer $PORT 
} || {
    python3 -m http.server $PORT
}