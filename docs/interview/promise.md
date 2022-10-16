> 作者：绯影

**前提**

1. 测试 [promises-aplus-tests](https://www.npmjs.com/package/promises-aplus-tests)

2. 创建微任务的方式 [queueMicrotask](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide)

## 1. 基本原理

1.  Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行

2.  Promise 会有三种状态

    - Pending 等待

    - Fulfilled 完成

    - Rejected 失败

3.  状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；

4.  Promise 中使用 resolve 和 reject 两个函数来更改状态；

5.  then 方法内部做的事情就是状态判断

    - 如果状态是成功，调用成功回调函数

    - 如果状态是失败，调用失败回调函数

## 2. 在 Promise 类中加入异步逻辑

- 缓存 then、catch 后面的回调

## 3. 实现 then 方法多次调用添加多个处理函数

- 用数组的形式缓存 then、catch 的回调

## 4. 实现 then 方法的链式调用

1. 怎样实现链式调用？

​ 返回一个 Promise 对象，记为 p1

2. 处理 then 回调函数的执行结果

（1）如果是普通值，那么直接用 p1 的 resolve 处理该值

（2）如果是一个新的 promise（记为 p2），那么在 p2.then 里面执行 p1 的 resolve, reject（其实就是等 p2 的状态发生变化以后，在执行 p1 的 resolve，并传入获取的 p2 的值）

```javascript
function resolvePromise(result, resolve, reject) {
  if (result instanceof myPromise) {
    // 如果result是一个promise，
    // 那么在then执行resolve，或者reject（其实就是等到状态发生改变的时候）
    result.then(
      (result) => {
        resolve(result)
      },
      (reason) => {
        reject(reason)
      }
    )
  } else {
    // 普通值，直接resolve
    resolve(result)
  }
}
```

3. 如果执行 p1 传入的函数时，发现原始 p 的类型没有发生变化，那么就把 p1 的 resolve 和 reject 一起进行缓存，等到在执行 p 的 resolve 或者 reject 的时候执行

```javascript
resolve = (value) => {
  // 修改状态
  if (this.status !== PENDING) {
    return
  }
  this.status = FULFILLED
  this.value = value

  // 如果有缓存，就执行（异步的情况）
  if (this.cacheObj.onFulfilledCbs.length > 0) {
    this.cacheObj.onFulfilledCbs.forEach(({ cb, resolve, reject }) => {
      // 处理then回调函数的返回结果
      const result = cb(this.value)
      resolvePromise(result, resolve, reject)
    })
  }
}
```

## 5. then 方法链式调用识别 Promise 是否返回自己

1. why？

   因为在 resolvePromise 中判断如果 result 是 Promise，那么就会在 result.then() 中执行 resolve，但是 result 的 resolve 却没有执行的时机，也就是 result 的状态永远都不会变，所以 p1.then 永远都不会执行，因为 p1 的状态永远不会变

```javascript
const promise = new MyPromise((resolve, reject) => {
  resolve('success')
})

let p1 = promise.then((value) => {
  console.log(1)
  return p1
})
```

## 6. 捕获错误及 then 链式调用其他状态代码补充

1. 通过 try...catch 进行捕捉

## 7. 参考 fulfilled 状态下的处理方式，对 rejected 和 pending 状态进行改造

## 8. then 中的参数变为可选

例子

```javascript
const promise = new Promise((resolve, reject) => {
  resolve(100)
})

promise
  .then()
  .then()
  .then()
  .then((value) => console.log(value))
```

设置默认 onFulfilled、onRejected

```javascript
then(onFulfilled, onRejected) {
    // 如果不传，就使用默认函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
}
```

## 9. 实现 resolve 与 reject 的静态调用

添加静态方法，注意：如果传入 resolve 的是一个 promsie 就直接返回

参考：[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6953452438300917790)
