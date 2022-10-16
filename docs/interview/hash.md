> 作者：绯影

参考：[https://juejin.cn/post/6850418120436711432#heading-3](https://juejin.cn/post/6850418120436711432#heading-3)

```
-   [hash] is a "unique hash generated for every build"
-   [chunkhash] is "based on each chunks' content"
-   [contenthash] is "generated for extracted content"
```

### 1. hash

`filename: "[name].[hash].js"`  
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2512738a69af4e37ad35e7b933d30433~tplv-k3u1fbpfcp-watermark.image?)  
hash：每次构建的生成唯一的一个 hash，且所有的文件 hash 串是一样的

修改某个文件的内容后，所有生成文件的 hash 值都会发生变化
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d3e46424c9f45a9bbfb24a43279394f~tplv-k3u1fbpfcp-watermark.image?)

### 2. chunkhash

`filename: "[name].[chunkhash].js`  
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ba9cd42c52147c9a2d1c906ee5c0767~tplv-k3u1fbpfcp-watermark.image?)  
每一个文件最后的 hash 根据它引入的 chunk 决定

修改 index 引入文件中某个文件的内容后  
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95071f6323b8421d806ef0c1b5bab9e1~tplv-k3u1fbpfcp-watermark.image?)

修改 index 的引入文件后  
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67ac6e80ee8b4783a30caf3c9ea2ca83~tplv-k3u1fbpfcp-watermark.image?)  
如果 detail 的 id 也发生变化，那么就是 module identifier 的原因，因为 index 新引入的模块改变了以后所有模块的 id 值，所以 detail 文件中引入的模块 id 值发生了改变  
解决方法：`new webpack.HashedModuleIdsPlugin()`

**chunkhash 存在的问题**  
有 css 的情况下，每个 entry file 会打包出来一个 js 文件和 css 文件，在使用 chunkhash 的情况下，js 和 css 的文件的 hash 会是一样的，这个时候暴露出来的一个问题：你修改一个 react 的 bug，但是并没有改样式，最后更新后，js 和 css 的文件的 hash 都变了。这个还是不太好，css 文件的 hash 串不变最好，再继续升级！

### 3. contenthash

使用 mini-css-extract-plugin 的时候进行配置

```js
new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].[contenthash:8].css',
  chunkFilename: '[name].[contenthash:8].chunk.css',
})
```

可以解决 chunkhash 的问题，保证 js 修改的时候，css 的打包文件不变；css 修改的时候，js 的打包文件不变
