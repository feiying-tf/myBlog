> 作者：绯影
> 参考：https://juejin.cn/post/7063010855167721486

## 1. css 覆盖

维护多套 css 样式，如下。

```css
// 亮色主题
.light {
  header: {
  }
  ,
  body: {
  }
  ,
  footer: {
  }
}

// 暗色主题
.dark {
  header: {
  }
  ,
  body: {
  }
  ,
  footer: {
  }
}
```

然后把默认主题设置为根节点的类，当切换主题时就修改根节点的类。
**缺点：** 多种主题样式都要引入，导致代码量增大

## 2. :root + var

1. 用 :root 的方式设置不同的主题

```css
:root {
  --theme-bg: #fff;
  --theme-color: rgb(51, 50, 50);
  --theme-img-bg: #fff;
  --theme-boder-color: #d6d6d6;
}

/* 暗黑：dark */
[data-theme='dark'] {
  --theme-bg: rgb(51, 50, 50);
  --theme-color: #fff;
  --theme-boder-color: #fff;
}
```

2. 元素使用样式

```css
<style scoped>
.header {
  ...省略
  color: var(--theme-color);
  border-bottom: 1px solid var(--theme-boder-color);
  background-color: var(--theme-bg);
}
...省略
</style>
```

3. 通过 js 修改修改 body 的 style 对应的 property

```javascript
body.style.setProperty('data-theme', isLight ? 'light' : 'dark')
```

## 3. webpack-theme-color-replacer
