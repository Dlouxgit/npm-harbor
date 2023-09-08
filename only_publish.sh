project=$1
randomId=$2
version=$3
gitHubToken=$4
npmToken=$5
extraCode=$6
branch=$7
userEmail=$8
userName=$9
preRelease=${10}

git clone -b $branch https://$gitHubToken@$project "$project_$randomId"

if [ ! -d "$project_$randomId" ]; then
  echo "获取仓库文件失败"
  exit 1
fi


cd "$project_$randomId"

eval "$extraCode"

# 检查退出状态码
if [ $? -ne 0 ]; then
    echo "错误：命令执行失败。" >&2
    exit 1
fi

echo "start publish";

npm config set //registry.npmjs.org/:_authToken="$npmToken"; 
npm publish;

echo "publish success";

rm -rf ../"$project_$randomId"