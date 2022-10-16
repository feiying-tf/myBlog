> 作者：绯影

## 1. 常用的性能测量工具

1. chrome Devtools 开发调试、性能评测（最常用）
2. webpack-bundle-analyzer 进行体积分析
3. lighthouse 网站整体质量评估
4. webpageTest 多测试地点、全面性能报告

## 2. web 端

### 2.1 构建层面

1. code splittting 代码拆分（防止模块被重复打包，拆分过大的 js 文件，合并零散的 js 文件）
2. 按需加载
3. tree shaking（把没有用的代码给去掉）
4. 路由懒加载
5. 图片懒加载
6. 资源压缩
7. 预渲染（不会变化的页面十分适合）
8. 服务端渲染（在意搜索引擎排名）

### 2.2 代码层面

1. preload、prefetch 的使用

### 2.3 体验方面

1. 可以在白屏阶段加上一个特定的 loading
2. 如果有过渡效果避免造成回流

## 3. 服务端

1. 设置 gzip 压缩
