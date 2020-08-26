export NODE_ENV=production

echo "----- Cleanup -----"
rm -rf prod

echo ""
echo "----- Start API Server -----"
(cd docs && npm run serve) &
sleep 10

echo ""
echo "----- Initiate frontend build -----"
(cd frontend && npm run build)

mkdir prod
mv frontend/dist prod/public

kill $(lsof -t -i:4444)

echo ""
echo "Done!"
