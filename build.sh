trap "exit" INT TERM ERR
trap "kill 0" EXIT

sh ./tasks.sh
