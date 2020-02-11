echo ""
echo "----- Install docs dependencies -----"
(cd docs && npm install)

echo ""
echo "----- Install Frontend dependencies -----"
(cd frontend && npm install)

echo ""
echo "------- Set permissions -------"
chmod +x ./develop.sh
chmod +x ./deploy.sh
chmod +x ./build.sh

echo ""
echo "Done"
