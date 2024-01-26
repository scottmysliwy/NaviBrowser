#!/bin/bash

function update() {
  curl -d '{"url": "'"$1"'"}' -H 'Content-Type: application/json' http://localhost:3000/update-window
}

function minimize() {
  curl http://localhost:3000/minimize
}

function restore() {
  curl http://localhost:3000/restore
}

# Check the number of arguments
if [ $# -lt 1 ]; then
  echo "Usage: $0 <function> [url]"
  exit 1
fi

# Switch statement to call the appropriate function
case "$1" in
  "update")
    if [ $# -lt 2 ]; then
      echo "Usage: $0 update <url>"
      exit 1
    fi
    update "$2"
    ;;
  "minimize")
    minimize
    ;;
  "restore")
    restore
    ;;
  *)
    echo "Invalid function: $1"
    exit 1
    ;;
esac


