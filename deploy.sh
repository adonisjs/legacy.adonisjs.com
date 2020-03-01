trap "exit" INT TERM ERR
trap "kill 0" EXIT

export NODE_ENV=production

sh ./tasks.sh

echo "---- Deploying API ----"
cp up.json prod/api
export AWS_PROFILE=adonis_prod
(cd prod/api && ../../up)

echo "---- Deploying Frontend ----"
npx netlify-cli deploy --dir=prod/public --prod
