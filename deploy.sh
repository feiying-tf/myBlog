#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist
cp -r ../../../tomyBlogWorkFlows/.github ./

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:feiying-tf/myBlog.git master:gh-pages
# 上传到阿里云
git push -f git@182.92.6.56:/home/www/website/ts.git master
cd -