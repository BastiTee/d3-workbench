#!/bin/sh

# chkconfig: 345 99 10
# description: Example startup/shutdown script for d3-wb-server
#
### BEGIN INIT INFO
# Provides:          d3-wb-server
# Required-Start:    $network $local_fs $remote_fs
# Required-Stop::    $network $local_fs $remote_fs
# Should-Start:      $all
# Should-Stop:       $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: d3-wb-server server suite
### END INIT INFO

# UNIQUE NAME
NAME="d3-wb-server"
# Daemon process (path to node installation)
DAEMON="$( dirname $( readlink -f $0 ))/start"
# Process indicator
PID_PATTERN="node d3-wb-server.js"

#######################################################
# NO CHANGES BELOW THIS POINT NECESSARY IN MOST CASES #
#######################################################

LOG_FILE="/var/log/${NAME}.log"

start_daemon () {
    nohup $DAEMON >$LOG_FILE 2>&1 </dev/null &
}

stop_daemon () {
    ps -ef | grep "$PID_PATTERN" | grep -v grep | awk '{print $2}' |\
    while read pid; do echo "Stopping pid: $pid"; kill -9 $pid 2> /dev/null; done
}

case "$1" in
    start)
        echo "Starting daemon: $NAME"
        start_daemon
    ;;
    stop)
        echo "Stopping daemon: $NAME"
        stop_daemon
    ;;
    restart)
        echo "Restarting daemon: $NAME"
        stop_daemon
        start_daemon
    ;;
    *)
        echo "Usage: "$1" {start|stop|restart}"
        exit 1
esac

exit 0
