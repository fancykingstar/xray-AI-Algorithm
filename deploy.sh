if [ $# -lt 1 ]; then
   echo "You must pass argument in the form user@IPADDR:/deploydir to deploy"
   exit
fi
fullpath=$1
user_at_host=$(echo $1 | cut -d: -f 1)
ipaddr=$(echo $user_at_host | cut -d@ -f 2)
deploy_dir=$(echo $1 | cut -d: -f 2)

GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo $GREEN"Deploying to "$ipaddr" @"$deploy_dir$NC

sed -i 's/AUTH_REQUIRED=false/AUTH_REQUIRED=true/' appserver/src/components/api.js
rm -rf aiweb/build
rm -rf appserver/build
cd appserver; yarn build; cd ..
sed -i 's/AUTH_REQUIRED=true/AUTH_REQUIRED=false/' appserver/src/components/api.js
cp -r appserver/build aiweb/build
sed -i s#localhost#$ipaddr# ./aiweb/build/keycloak.json

rsync --recursive -azvhe ssh --progress --delete models $fullpath
rsync --recursive --exclude='*.sh' --exclude="*.js" --exclude="*.proto" -azvhe ssh --delete aiserver $fullpath
rsync --recursive --exclude='node_modules' -azvhe ssh --delete aiweb $fullpath

rsync -avhe ssh config_depl.yml $fullpath/aiserver/config.yml
rsync -avhe ssh config_depl.yml $fullpath/aiweb/config.yml
rsync -avhe ssh docker-compose.yml $fullpath/
