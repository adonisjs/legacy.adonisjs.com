trap "exit" INT TERM ERR
trap "kill 0" EXIT

export NODE_ENV=development

echo ""
echo "----- Start API Server -----"
(cd docs && npm run serve) &
sleep 5

echo ""
echo "----- Start Frontend Server -----"
(cd frontend && npm run develop)

wait
