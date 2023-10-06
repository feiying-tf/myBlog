> 作者：绯影

### 1. 在项目中使用 require、import、export

- babel 会把 export 转换为 exports

```javascript
const name = 'name'
const test = 'test'
export { name, test }
export default {
  name,
  test,
}
// -->
Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.test = exports.name = exports.default = void 0
const name = 'name'
exports.name = name
const test = 'test'
exports.test = test
var _default = {
  name,
  test,
}
exports.default = _default
```

- babel 会把 import 转换为 require

```javascript
import common from './util/common'
// -->
var _common = _interopRequireDefault(require('./util/common'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}
```

### 2. 前端模块化

[browser Vs module Vs main](https://www.cnblogs.com/qianxiaox/p/14041717.html)  
 总结：在 web 端 browser > module > main
使用 webpack 构建自己项目的时候，有一个 target 选项，默认为 web，即进行 web 应用构建。构建 node 项目，则把 target 改成 node（这个属性是引入我们需要资源的根据）

1. exports  
   `exports` 的优先级高于 `module`。在有 `exports` 的情况下，如果没有在 `exports` 里面执行 `import` 的路径，同时外面也有 `module` 字段，此时也是无法正确找到路径的。只有在没有 `exports` 的情况下才会去查找 `module`。`exports` 的结构如下时

```json
"exports": {
   ".": {
      "types": "./dist/vue.d.ts",
      "import": { // 使用 import 将引入的路径
         "node": "./index.mjs",
         "default": "./dist/vue.runtime.esm-bundler.js"
      },
      "require": "./index_1.js" // 使用require将引入这个路径
   },
   "./server-renderer": {
      "types": "./server-renderer/index.d.ts",
      "import": "./server-renderer/index.mjs",
      "require": "./server-renderer/index.js"
   },
}
```

- 那么通过 `import xx from 'xx/server-renderer'` 就能引入到 `server-renderer.mjs` 里面的内容
- 查看 `require` 引入 `vue` 的包的真实路径, `console.log(require.resolve("vue"));` 注意 `require` 的时候如果 `package.json` 里面没有 `require` 属性，那么将使用 `import` 里面的 `default` 属性

* 在使用 `require` 的时候，如果 `exports` 属性没有 `require` 属性、`import` 属性里面没有 `default` 属性，那么 `require` 将失败，只有在没有 `exports` 的情况下，才会默认去找 `main` 属性。
