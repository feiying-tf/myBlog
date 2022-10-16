> 作者：绯影

1. position: relative + overflow: auto 的注意事项

```html
<style>
  .parent {
    width: 300px;
    height: 300px;
    overflow: auto;
    position: relative;
  }
  .child1 {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: red;
  }
  .child2 {
    height: 1000px;
    background-color: green;
  }
</style>
<body>
  <div class="parent">
    <div class="child1"></div>
    <div class="child2"></div>
  </div>
</body>
```

这种方式无法实现，child2 滚动的时候，child1 固定在 parent 顶部。child1 会跟着一起滚动。

解决方法：让 child1、child2 都是 absolute 定位,把内容放到 child1 里面

```html
<style>
  .parent {
    width: 300px;
    height: 300px;
    /* overflow: auto; */
    position: relative;
  }
  .child1 {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: red;
  }
  .child2 {
    width: 300px;
    height: 300px;
    position: absolute;
    /* overflow: hidden; */
    overflow: auto;
    left: 0;
    top: 0;
    background-color: green;
  }
  .child3 {
    height: 1000px;
    width: 150px;
    background-color: pink;
  }
</style>
</head>
<body>
<div class="parent">
  <div class="child1">
    <div class="child3"></div>
  </div>
  <div class="child2"></div>
</div>
</body>
```
