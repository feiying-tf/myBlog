> 作者：绯影

1. `async` 执行返回的是一个状态为 fulfilled 的 Promise

```javascript
async function fn() {}
console.log(fn) // [AsyncFunction: fn]
console.log(fn()) // Promise {<fulfilled>: undefined}
```

但是值为 undefined

2. 当 async 返回一个值时，就可以在 then 里面获取到这个值

```javascript
async function fn(num) {
  return num
}
console.log(fn) // [AsyncFunction: fn]
console.log(fn(10)) // Promise {<fulfilled>: 10}
fn(10).then((res) => console.log(res)) // 10
```

3. async/await 是一种 generator 的语法糖

```javascript
// generatorFn 执行
function generatorToAsync(generatorFn) {
  // gen有可能传参，
  const gen = generatorFn.apply(this, arguments)
  // 返回一个具有async功能的函数，其实就是循环的执行next
  return function () {
    // async函数执行返回一个promise
    return new Promise((resolve, reject) => {
      // key 可以是next、throw
      function go(key, value) {
        let res
        // 捕获错误
        try {
          res = gen[key](value)
        } catch {
          return reject(error)
        }
        const { value, done } = res
        // 已经执行完成
        if (done) {
          return resolve(value)
        } else {
          // 因为value可能是一个常量
          return Promise.resolve(value).then(
            (val) => go('next', val),
            (err) => go('throw', err)
          )
        }
      }
    })
  }
}

// 测试
function fn(nums) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1)
  const num2 = yield fn(num1)
  const num3 = yield fn(num2)
  return num3
}
const asyncFn = generatorToAsync(gen)
asyncFn().then((res) => console.log(res))
```
