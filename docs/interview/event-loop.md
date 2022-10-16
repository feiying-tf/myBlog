> 作者：绯影

## 1. 事件循环

1. 事件循环由宏任务和在执行宏任务期间产生的所有微任务组成。完成当下的宏任务后，会立刻执行所有在此期间入队的微任务

2. Js 有两种任务的执行模式：**同步模式（Synchronous）和异步模式（Asynchronous）**, 在异步模式下，创建**异步任务主要分为宏任务与微任务两种**

- 常见的宏任务：

> script（整体代码）/setTimout/setInterval/setImmediate(node 独有)/requestAnimationFrame(浏览器独有，这个有争议)/IO/UI render（浏览器独有）

- 常见的微任务

> **process.nextTick(node 独有)**/**Promise.then()**/Object.observe/MutationObserver

3. 事件循环的工作，

## 2. 事件循环中宏微任务

### 2.1 浏览器的事件循环

1. 浏览器的事件循环由一个宏任务队列 + 多个微任务队列组成。

   - 首先，执行第一个宏任务：全局 Script 脚本。产生的的宏任务和微任务进入各自的队列中。执行完 Script 后，把当前的微任务队列清空。完成一次事件循环。

   - 接着再取出一个宏任务，同样把在此期间产生的回调入队。再把当前的微任务队列清空。以此往复。
   - 宏任务队列只有一个，而每一个宏任务都有一个自己的微任务队列，每轮循环都是由一个宏任务+多个微任务组成

### 2.2 Node 的事件循环

#### 2.2.1 概念

1. 当 Node 开始执行脚本时，**会先进行事件循环的初始化**，但是这时事件循环还没有开始，会先完成下面的事情。

- 同步任务
- 发出异步请求
- 规划定时器生效的时间
- 执行`process.nextTick()`等等

上面这些事情都干完了，事件循环就正式开始了

2. 由 1 可知，**node 只有一个主线程，事件循环是在主线程上完成的**

#### 2.2.2 事件循环组成

1. 由 6 个宏任务队列 + 6 个微任务队列组成。（优先级：从高到低）

   ![image-20220328152143161](/Users/tangfeng/Library/Application Support/typora-user-images/image-20220328152143161.png)

​

2. 需要关注的是：Timers、Poll、Check 阶段

> 1. Timers：定时器 setTimeout/setInterval；
>
> 2. Poll ：获取新的 I/O 事件, 例如操作读取文件等；
>
>    - 事件循环将同步执行 poll 队列里的回调，直到队列为空或执行的回调达到系统上限
>    - 如果没有其他阶段的事要处理，事件循环将会一直阻塞在这个阶段，等待新的 I/O 事件加入 poll 队列中
>    - 当检测到 io 有完成的状态，以及有检测到过期了，都会结束 poll 循环
>
> 3. Check：setImmediate 回调函数在这里执行；

3. node 端微任务也有优先级先后

> 1.  process.nextTick;
> 2.  promise.then 等;

```javascript
Promise.resolve().then(function () {
  console.log('微任务promise')
})

process.nextTick(() => {
  console.log('微任务nextTick')
})

// 微任务nextTick
// 微任务promise
```

#### 2.2.3 node11.x 之前

1. 由 6 个宏任务队列+6 个微任务队列组成。
2. 执行规律是：在一个宏任务队列全部执行完毕后，去清空一次微任务队列，然后到下一个等级的宏任务队列，以此往复
3. 一个宏任务队列搭配一个微任务队列。六个等级的宏任务全部执行完成，才是一轮循环

#### 2.2.4 node11.x 之后

1. node 端的事件循环变得和浏览器类似。先执行一个宏任务，然后是一个微任务队列。但依然保留了宏任务队列和微任务队列的优先级。

```javascript
console.log('Script开始')
setTimeout(() => {
  console.log('宏任务1（setTimeout)')
  Promise.resolve().then(() => {
    console.log('微任务promise2')
  })
}, 0)
setImmediate(() => {
  console.log('宏任务2')
})
setTimeout(() => {
  console.log('宏任务3（setTimeout)')
}, 0)
console.log('Script结束')
Promise.resolve().then(() => {
  console.log('微任务promise1')
})
process.nextTick(() => {
  console.log('微任务nextTick')
})

---------------运行结果-----------------
// 注意： 最后两个打印的内容setImmediate 与 setTimeout的执行顺序是不确定的，与回调函数进入的时机有关

Script开始
Script结束
微任务nextTick
微任务promise1
宏任务1（setTimeout)
微任务promise2
宏任务3（setTimeout)
宏任务2（setImmediate)

```

#### 2.2.5 分为宏任务和微任务的意义

1. 为了给高优先级任务一个插队的机会：微任务比宏任务有更高优先级

#### 2.2.6 事件回调函数**进入的时机**

```javascript
// 案例一
setTimeout(() => {
  console.log('setTimeout')
})

setImmediate(() => {
  console.log('setImmediate')
})
// 输出结果：
// 不确定，setTimeout 和 setImmediate 无法确定进入时机

// 案例二：
fs.readFile('file.path', (err, file) => {
  setTimeout(() => {
    console.log('setTimeout')
  })

  setImmediate(() => {
    console.log('setImmediate')
  })
})
// 输出结果：setImmediate setTimeout

// 案例三：
setTimeout(() => {
  console.log('setTimeout1')
  setImmediate(() => {
    console.log('setImmediate2')
  })
  setTimeout(() => {
    console.log('setTimeout2')
  })
})
// 输出结果：setTimeout1 setImmediate2 setTimeout2
```

1. 注意事项

   - 二者都从主模块内调用，则计时器将受进程性能的约束

   - 把这两个函数放入一个 I/O 循环内调用，setImmediate 总是被优先调用

   - 如果`setImmediate()`是在 I/O 周期内被调度的，那它将会在其中任何的定时器之前执行，跟这里存在多少个定时器无关

2. 如何理解案例一中，setTimeout 和 setImmediate 无法确定进入时机

在 nodejs 中，setTimeout 的封装函数如下

```javascript
function setTimeout(callback, after, arg1, arg2, arg3) {
  validateFunction(callback, 'callback')

  let i, args
  switch (arguments.length) {
    // fast cases
    case 1:
    case 2:
      break
    case 3:
      args = [arg1]
      break
    case 4:
      args = [arg1, arg2]
      break
    default:
      args = [arg1, arg2, arg3]
      for (i = 5; i < arguments.length; i++) {
        // Extend array dynamically, makes .apply run much faster in v6.0.0
        args[i - 2] = arguments[i]
      }
      break
  }

  const timeout = new Timeout(callback, after, args, false, true)
  insert(timeout, timeout._idleTimeout)

  return timeout
}
```

内部调用了 Timeout

```javascript
function Timeout(callback, after, args, isRepeat, isRefed) {
  after *= 1 // Coalesce to number or NaN
  if (!(after >= 1 && after <= TIMEOUT_MAX)) {
    if (after > TIMEOUT_MAX) {
      process.emitWarning(`...`)
    }
    after = 1 // 但我们传 0 或者不传的时候，这儿会被重置为1
  }
  // ...
  this._idleTimeout = after
  this._onTimeout = callback

  initAsyncResource(this, 'Timeout')
}
```

也就是说当我们进入到事件循环的时候，能否首先打印出 setTimeout 的内容，取决于定时器是否已经过时（也就是是否超过了 1ms，这就取决于执行的效率了）。而当我们在 I/O 周期内部调用时，当当前循环内，check 阶段肯定会先到来，而 Timers 周期在下一个循环中执行。（**在 setTimeout 回调内部添加的 setTimeout 会被加到了下个 timers 阶段**）

参考资料：

[熟悉事件循环？那谈谈为什么会分为宏任务和微任务](https://juejin.cn/post/7073099307510923295)

[NODE 宏任务微任务全解](https://zhuanlan.zhihu.com/p/347819241)

[Node 事件循环机制](https://juejin.cn/post/6844904137662922760)
