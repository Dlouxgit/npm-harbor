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
shouldPublish=${11}

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

git config user.email $userEmail
git config user.name $userName

release-it $version --preRelease=$preRelease --only-version --no-npm.publish --no-git.commit --no-git.push  --'hooks.after:release="if [ '"$shouldPublish"' = 0 ]; then git checkout -b release/v${version}; fi;conventional-changelog -p angular -i CHANGELOG.md -s -r 0; git add . ; git commit -m "Release: v${version}" ; git push https://'"$gitHubToken"'@'"$project"'; git push https://'"$gitHubToken"'@'"$project"' --tags; npm config set //registry.npmjs.org/:_authToken='"$npmToken"';"'

if [ "$shouldPublish" = "1" ]; then
  npm publish
  echo "publish success"
else
  echo "generate changelog success"
  echo "创建新分支 release/v$(node -p "require('./package.json').version")"
fi

rm -rf ../"$project_$randomId"