> 作者：绯影

#### 1. stylelint-config-standard-scss 能够只针对 scss，

是因为 rules 前面都是以 scss 开头的，例如

```json
{
  "scss/at-else-closing-brace-newline-after": "always-last-in-chain",
  "scss/at-else-closing-brace-space-after": "always-intermediate",
  "scss/at-else-empty-line-before": "never"
}
```

less 也是如此，less 的规则是 `less/xxxx`

这是 stylelint 插件的规则

#### 2. 理解 customSyntax 与 extends

```js
  overrides: {
     files: ['**/*.(less|css)'],
     customSyntax: 'postcss-less',
  },
```

将用 postcss-less 去解析代码。如果解析不成功将会报错。而 extends stylelint-config-standard-scss 则是去匹配规则，这些规则是由 stylelint-scss 去定义的

#### 3. postcss-less、postcss-scss 做的事情

将 SCSS 或 LESS 语法解析成可以在 AST 上进行处理的格式，而最终的样式处理和转换工作则是由后续的 PostCSS 插件完成的。（现在 postcss 通常不处理 scss、less，只处理 scss、less 转换后的结果。因为 postcss-less-engine、postcss-less、postcss-sass 不再维护）

#### 4. stylelint 保存格式化生效的来源

格式化的规则将按照 .stylelintrc.js 里面的设置

```json
"editor.codeActionsOnSave": {
  "source.fixAll.stylelint": true
},
```

#### 5. stylelint-config-recommended-vue

1. 使用时，`<style>`里面的 `.xxx` 会报错，所以最好不好使用，对 `stylelint-config-recommended` 进行扩展，捆绑 `postss-html` 自定义语法并对其进行配置，那么 `overrides` 里面的 `postcss-html` 就只需要设置 `html` 文件

```js
overrides: [
// 扫描 html文案件中的<style>标签内的样式
  {
    files: ['**/*.(html)'],
    customSyntax: 'postcss-html',
  },
],
```

2. 如果没有使用 `stylelint-config-recommended-vue`，那么 `overrides` 的 `postcss-html` 就要同时对 `html`、`vue` 进行设置

```js
overrides: [
// 扫描 html文案件中的<style>标签内的样式
  {
    files: ['**/*.(html|vue)'],
    customSyntax: 'postcss-html',
  },
],
```

#### 6. stylelint-config-prettier

关闭所有不必要的或可能与 `Prettier` 冲突的规则。这可以让你使用你最喜欢的可共享配置，而不会让它的风格选择妨碍你使用 `Prettier`。

#### 7. 使用时的一些报错的情况

1. 如果 `vue` 的`style` 里面使用 `scss`，报 `TypeError: opts.node.rangeBy is not a function` ，此时安装 `postcss-scss` 依赖
