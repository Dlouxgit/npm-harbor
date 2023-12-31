project=$1
randomId=$2
version=$3
gitHubToken=$4
npmToken=$5
extraCode=$6
branch=$7
preRelease=$8

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

echo $(cat ./package.json | grep -m 1 "\"version\"" | awk -F: '{ gsub(/"/,"",$2); gsub(/,/,"",$2); print $2 }') "->"

release-it $version --preRelease=$preRelease --release-version --only-version --no-npm.publish --no-git.commit --no-git.push

rm -rf ../"$project_$randomId"