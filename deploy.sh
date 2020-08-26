export NODE_ENV=production

echo "----- Cleanup -----"
echo "> rm -rf prod"
rm -rf prod

echo ""
echo "----- Start API Server -----"
cd docs && npm run serve &

SERVER_PID=$!

sleep 10

echo ""
echo "----- Initiate frontend build -----"
(cd frontend && npm run build)

mkdir prod
mv frontend/dist prod/public

echo ""
echo "Done!"

pkill -P $$
