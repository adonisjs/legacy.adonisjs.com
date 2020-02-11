trap "exit" INT TERM ERR
trap "kill 0" EXIT

sh ./tasks.sh

echo "---- Deploying API ----"
cp up.json prod/api
export AWS_PROFILE=adonis_prod
(cd prod/api && up)

echo "---- Deploying Frontend ----"
export NETLIFY_SITE_ID=60d8e77e-32c9-45ac-a060-68095983591c
netlify deploy --dir=prod/public

kill 0
