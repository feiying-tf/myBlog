> 作者：绯影

1. 在项目中使用 require、import、export

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

2. [browser Vs module Vs main](https://www.cnblogs.com/qianxiaox/p/14041717.html)  
   总结：在 web 端 browser > module > main
   使用 webpack 构建自己项目的时候，有一个 target 选项，默认为 web，即进行 web 应用构建。构建 node 项目，则把 target 改成 node（这个属性是引入我们需要资源的根据）
