---
title: cookie、localStorage、sessionStorage
author: 绯影
---

## 1. 不同之处？

1. 存储空间不同，

- cookie：4KB 左右
- localStorage 和 sessionStorage：可以保存 5MB 的信息。

2. 生命周期

- cookie：可设置失效时间，没有设置的话，默认是关闭浏览器后失效

- localStorage：除非被手动清除，否则将会永久保存。

- sessionStorage： 仅在当前网页会话下有效，关闭页面或浏览器后就会被清除。（在同一个网页，如果是单页面的话可以共享，在新页面打开，就没有了，所以用得很少）

## 2. 什么时候使用？

1. cookie：存放 token（可以设置过期时间）
2. localStorage: 用户信息（也可以自己封装一个兼容过期时间的方法，每次取值的时候进行判断）
