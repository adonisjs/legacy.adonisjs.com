echo "----- Cleanup -----"
rm -rf prod

echo ""
echo "----- Start API Server -----"
(cd docs && npm run serve) &
sleep 2

echo ""
echo "----- Initiate frontend build -----"
(cd frontend && npm run build)

echo ""
echo "----- Build API for prod -----"
(cd docs && npm run build)

echo ""
echo "----- Setup prod artifacts -----"

mkdir prod
mv frontend/dist prod/public
mv docs/dist prod/api
cp app.js prod/api
(cd prod/api && npm init --yes)
(cd prod/api && npm i @dimerapp/http-server)

echo ""
echo "Done!"
