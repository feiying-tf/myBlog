#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist
# 复制文件流
cp -r ../../../tomyBlogWorkFlows/.github ./

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:feiying-tf/myBlog.git master:gh-pages
# 上传到腾讯云
git push -f git@124.222.3.78:/home/www/website/myBlog.git master
cd -