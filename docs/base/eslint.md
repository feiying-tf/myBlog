> 作者：绯影

### eslintrc.js

#### 1. extends

extends  属性值可以省略包名的前缀  `eslint-config-`，例：

```js
extends: [
  'eslint-config-myconfig',
  'plugin:eslint-plugin-myplugin/recommended',
  '@scope/myconfig'
]
==
extends: [
  'myconfig',
  'plugin:myplugin/recommended',
  '@scope/eslint-config-myconfig'
]
```

`extends` 里面的 `plugin:name/attr` 写法，代表了从 name 插件中使用 attr 对应的规则集合，这儿的插件名的缩写遵循 2 里面的 plugins 的缩写规则

分析下面的例子

```js
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    "plugin:@bar/recommended"
  ],
```

- `plugin:vue/vue3-essential` 对应的应该是 `eslint-plugin-vue/vue3-essential`，也就是是找到 `eslint-plugin-vue` 导出的内容，然后找到里面的 `configs` 对应的 `vue3-essential` 对应的规则集合

* `plugin:@bar/recommended` 代表的是 `@bar/eslint-plugin` 对应导出文件的 `configs` 里面的 `recommended`

#### 2. plugins

1. 可以省略  `eslint-plugin-`  前缀，例：

```js
"plugins": [ "plugin1", "eslint-plugin-plugin2" ]
===
"plugins": [ "eslint-plugin-plugin1", "plugin2"]

"plugins": [
  "jquery",   // eslint-plugin-jquery
  "@foo/foo", // @foo/eslint-plugin-foo
  "@bar"      // @bar/eslint-plugin
],
```

2. 如何理解 `plugins` 与 `extends`?

加载插件以后，相当于赋予了 `eslint` 解析某些规则（插件里面 rules）的能力，而 `extends` 其实是继承别人配置好的内容。通常分为**两种情况**

- 在 `eslintrc.js` 里面只有 `extends` ，没有 `plugins`。

以上面的 `@vue/eslint-config-typescript` 为例，此时说明 `@vue/eslint-config-typescript` 这个插件包含了自己所需的 plugins

```js
// 下面是 @vue/eslint-config-typescript 对应的部分代码
module.exports = {
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/eslint-recommended'],
  // ...
}
```

- `plugins` 和 `extends` 同时存在

此时其实就是继承这个插件导出内容对应`configs`里面的设置，以 `@vue/eslint-config-typescript` 为例

```js
// 这儿是 @typescript-eslint 里面的内容
module.exports = {
  rules: rules_1.default,
  configs: {
    all: all_1.default,
    base: base_1.default,
    recommended: recommended_1.default,
    'eslint-recommended': eslint_recommended_1.default,
    'recommended-requiring-type-checking':
      recommended_requiring_type_checking_1.default,
    strict: strict_1.default,
  },
}
```

`extends: ['plugin:@typescript-eslint/eslint-recommended'],` 其实就是找到 `eslint-recommended`对应的设置，此时 `extends` 里面的内容通常不需要包含 `plugins` 设置（因为 `@vue/eslint-config-typescript` 里面的 `plugins` 已经设置了）
