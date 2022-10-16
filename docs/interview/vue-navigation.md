> 作者：绯影

## 1. 功能

实现前进刷新，后退用缓存

## 2. 关键思路

1. this.$slots.default

通过 `this.$slots.default` 的方式获取 `<navigation></navigation>`包裹组件的 vnode

2. VNK

通过 `VNK` 对页面进行标记，在 `router.beforeEach` 里面，会对 `query` 进行标准化，保证每个进入的页面都有这个标记。这样当我们通过 `this.$router.push()` 添加新的页面时，都会产生新的 `VNK`

3. routes

用一个栈 `routes` 对整个 `route` 进行维护，每个 `route` 都将以一个特殊的包含 `VNK` 的特殊的 `key` 进行存储。在 `router.afterEach` 中会调用 `record` 的方法，根据传入的 `toRoute` 可以对 `routes` 执行不同的操作。

4. watch
   在` watch` 里面监听 `routes` 的变化，对于没有在 `routes` 里面的`vnode`，要及时执行进行销毁，并从缓存中删除

5. render + this.cache

缓存是在 `render` 中完成的，用 `this.cache` 进行缓存，在 `render` 的时候，如果 `key` 命中 `this.cache`，那么重置 `vnode.componentInstance = this.cache[key].componentInstance`，否则就进行缓存 `this.cache[key] = vnode;`
**注意：** `render`里面会重置 vnode.key，这是为了避免`/goods/:id` 这种情况造成组件复用问题

6. <navigation></navigation>

`<navigation></navigation>` 要放在 `<router-view></router-view>` 里面，因为路由发生变化以后，会触发 `<router-view></router-view>` 的修改，从而触发 `<navigation></navigation>` `render`的重新执行。这样就会给`router-view` 对应的 `vnode` 的 `key`进行修改，从而重新渲染`router-view`查找到的组件。

7. keepAlive

设置 `vnode.data.keepAlive = true; `，为了 slot 里面的组件能使用 activated 生命周期

8. 整体流程

- 页面发生改变，触发 beforeEach，为 path 添加标记 VNX 标记。

- 在 afterEach 中调用 record 方法，对 routes 进行操作，包括 forward、refresh、back（当从浏览器的回退按钮进行回退时，会把 from 对应的记录进行删除，这样当再次点击右箭头的时候，会发现页面时重新渲染的）

- 在 render 的时候会进行缓存处理

9. scroll

存储页面滚动的位置，封装一个外层组件 Page

```html
<div class="page">
  <div class="content" @scroll="scroll" ref="content">
    <slot></slot>
  </div>
</div>

<script>
  export default {
    name: 'page',
    data() {
      return {
        scrollTop: 0,
      }
    },
    methods: {
      back() {
        window.history.back()
      },
      scroll() {
        this.scrollTop = this.$refs.content.scrollTop
      },
    },
    activated() {
      this.$refs.content.scrollTop = this.scrollTop
    },
  }
</script>
```

## 3. 源码分析

```javascript
/**
 * vue-navigation v1.1.4
 * https://github.com/zack24q/vue-navigation
 * Released under the MIT License.
 */

var routes = []

if (window.sessionStorage.VUE_NAVIGATION) {
  routes = JSON.parse(window.sessionStorage.VUE_NAVIGATION)
}

var Routes = routes

// 生成key的函数
function genKey() {
  var t = 'xxxxxxxx'
  return t.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0
    var v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getKey(route, keyName) {
  return (route.name || route.path) + '?' + route.query[keyName]
}

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  return false
}

// 判断两个对象是否相等
function isObjEqual(obj1, obj2) {
  // .....
}

var Navigator = function (bus, store, moduleName, keyName) {
  // 如果传入了store，那么就把一些信息注册到store上面
  if (store) {
    store.registerModule(moduleName, {
      state: {
        routes: Routes,
      },
      // store 里面修改 routes 的方法，
      mutations: {
        'navigation/FORWARD': function navigationFORWARD(state, _ref) {
          var to = _ref.to,
            from = _ref.from,
            name = _ref.name

          state.routes.push(name)
        },
        'navigation/BACK': function navigationBACK(state, _ref2) {
          var to = _ref2.to,
            from = _ref2.from,
            count = _ref2.count

          state.routes.splice(state.routes.length - count, count)
        },
        'navigation/REPLACE': function navigationREPLACE(state, _ref3) {
          var to = _ref3.to,
            from = _ref3.from,
            name = _ref3.name

          state.routes.splice(Routes.length - 1, 1, name)
        },
        'navigation/REFRESH': function navigationREFRESH(state, _ref4) {
          var to = _ref4.to,
            from = _ref4.from
        },
        'navigation/RESET': function navigationRESET(state) {
          state.routes.splice(0, state.routes.length)
        },
      },
    })
  }
  // 前进方法
  var forward = function forward(name, toRoute, fromRoute) {
    var to = { route: toRoute }
    var from = { route: fromRoute }
    // 获取routes
    var routes = store ? store.state[moduleName].routes : Routes
    // 获取栈中的最后一个name
    from.name = routes[routes.length - 1] || null
    to.name = name
    // 如果有store，对应修改store里面的信息，在栈里面添加新的导航名
    store
      ? store.commit('navigation/FORWARD', { to: to, from: from, name: name })
      : routes.push(name)
    // 修改 sessionStorage.VUE_NAVIGATION 里面的内容
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes)
    // 派发forward事件
    bus.$emit('forward', to, from)
  }
  // 回退方法，当进行回退的时候，会把回退的from页面从站里面删除
  var back = function back(count, toRoute, fromRoute) {
    var to = { route: toRoute }
    var from = { route: fromRoute }
    var routes = store ? store.state[moduleName].routes : Routes
    from.name = routes[routes.length - 1]
    to.name = routes[routes.length - 1 - count]
    store
      ? store.commit('navigation/BACK', { to: to, from: from, count: count })
      : routes.splice(Routes.length - count, count)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes)
    bus.$emit('back', to, from)
  }
  // 替换方法
  var replace = function replace(name, toRoute, fromRoute) {
    var to = { route: toRoute }
    var from = { route: fromRoute }
    var routes = store ? store.state[moduleName].routes : Routes

    from.name = routes[routes.length - 1] || null
    to.name = name
    store
      ? store.commit('navigation/REPLACE', { to: to, from: from, name: name })
      : routes.splice(Routes.length - 1, 1, name)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes)
    bus.$emit('replace', to, from)
  }
  // 刷新方法
  var refresh = function refresh(toRoute, fromRoute) {
    var to = { route: toRoute }
    var from = { route: fromRoute }
    var routes = store ? store.state[moduleName].routes : Routes
    to.name = from.name = routes[routes.length - 1]
    store ? store.commit('navigation/REFRESH', { to: to, from: from }) : null
    bus.$emit('refresh', to, from)
  }
  // 重置方法，将 routes 置为空
  var reset = function reset() {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([])
    bus.$emit('reset')
  }

  var record = function record(toRoute, fromRoute, replaceFlag) {
    // 获取name，格式为：`路由名?标识码`，标识码就是 VNK 对应的值
    var name = getKey(toRoute, keyName)
    // 调用 replace 方法
    if (replaceFlag) {
      replace(name, toRoute, fromRoute)
    } else {
      // 从 Routes 中查找 name 的属性的 index
      var toIndex = Routes.lastIndexOf(name)
      // 根据 index 的值可以得出对应的操作
      if (toIndex === -1) {
        forward(name, toRoute, fromRoute)
      } else if (toIndex === Routes.length - 1) {
        refresh(toRoute, fromRoute)
      } else {
        back(Routes.length - 1 - toIndex, toRoute, fromRoute)
      }
    }
  }

  return {
    record: record,
    reset: reset,
  }
}

var NavComponent = function (keyName) {
  return {
    name: 'navigation',
    abstract: true,
    props: {},
    data: function data() {
      return {
        routes: Routes,
      }
    },
    computed: {},
    watch: {
      // 监听routes的变化
      routes: function routes(val) {
        // 将不在 routes 对应的 vnode 进行销毁，并且从缓存中删除
        for (var key in this.cache) {
          if (!matches(val, key)) {
            var vnode = this.cache[key]
            vnode && vnode.componentInstance.$destroy()
            delete this.cache[key]
          }
        }
      },
    },
    created: function created() {
      this.cache = {}
    },
    destroyed: function destroyed() {
      // 将缓存的所有组件全部进行销毁
      for (var key in this.cache) {
        var vnode = this.cache[key]
        vnode && vnode.componentInstance.$destroy()
      }
    },
    render: function render() {
      // 获取router-view里面的内容的vnode
      var vnode = this.$slots.default ? this.$slots.default[0] : null
      console.log('vnode', vnode)
      if (vnode) {
        // 获取vnode的key
        vnode.key = vnode.key || (vnode.isComment ? 'comment' : vnode.tag)

        var key = getKey(this.$route, keyName)
        // 重新设置vnode.key
        if (vnode.key.indexOf(key) === -1) {
          vnode.key = '__navigation-' + key + '-' + vnode.key
        }
        // 如果缓存中已经有对应的vnode
        if (this.cache[key]) {
          // 命中缓存
          if (vnode.key === this.cache[key].key) {
            // 修改vnode的实例为缓存的实例
            vnode.componentInstance = this.cache[key].componentInstance
          } else {
            this.cache[key].componentInstance.$destroy()
            this.cache[key] = vnode
          }
        } else {
          // 没有命中则直接进行缓存
          this.cache[key] = vnode
        }
        // vnode.data.keepAlive = true;
      }
      return vnode
    },
  }
}

var _extends =
  Object.assign ||
  function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
}

var index = {
  // 1. 解析传入的参数
  // 2. 创建一个导航器，包含要操作的forward、back等方法
  // 3. 绑定router.replace方法
  // 4. 设置全局路由守卫
  install: function install(Vue) {
    // arguments[1] 是传入的options，包含router,store等信息
    var _ref =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      router = _ref.router, // 获取传入的router
      store = _ref.store, // 获取传入的store
      _ref$moduleName = _ref.moduleName, // 获取moduleName
      moduleName =
        _ref$moduleName === undefined ? 'navigation' : _ref$moduleName,
      _ref$keyName = _ref.keyName, // 获取keyName
      keyName = _ref$keyName === undefined ? 'VNK' : _ref$keyName // 默认值为VNK，这也是path上面有个VNK的原因

    if (!router) {
      console.error('vue-navigation need options: router')
      return
    }
    // 创建一个event bus
    var bus = new Vue()
    // 创建一个导航器
    var navigator = Navigator(bus, store, moduleName, keyName)
    // routerReplace 中的this始终指向router
    var routerReplace = router.replace.bind(router)
    var replaceFlag = false
    // 避免调用router方法时，内部this丢失的情况
    router.replace = function (location, onComplete, onAbort) {
      replaceFlag = true
      routerReplace(location, onComplete, onAbort)
    }
    // 全局前置路由守卫
    router.beforeEach(function (to, from, next) {
      // 如果去的页面不包含 VNK，那么就手动添加VNK
      if (!to.query[keyName]) {
        var query = _extends({}, to.query)

        if (
          to.path === from.path &&
          isObjEqual(
            _extends({}, to.query, _defineProperty({}, keyName, null)),
            _extends({}, from.query, _defineProperty({}, keyName, null))
          ) &&
          from.query[keyName]
        ) {
          query[keyName] = from.query[keyName]
        } else {
          query[keyName] = genKey()
        }
        next({
          name: to.name,
          params: to.params,
          query: query,
          replace: replaceFlag || !from.query[keyName],
        })
      } else {
        next()
      }
    })
    // 全局后置路由守卫
    router.afterEach(function (to, from) {
      // 调用 navigator.record 方法，对 routes 进行操作
      navigator.record(to, from, replaceFlag)
      replaceFlag = false
    })

    // 创建一个vue组件
    Vue.component('navigation', NavComponent(keyName))

    // 创建静态方法，以及挂载到 $navigation 上
    Vue.navigation = Vue.prototype.$navigation = {
      // 这些都是暴露的方法，可以在外面进行注册
      on: function on(event, callback) {
        bus.$on(event, callback)
      },
      once: function once(event, callback) {
        bus.$once(event, callback)
      },
      off: function off(event, callback) {
        bus.$off(event, callback)
      },
      getRoutes: function getRoutes() {
        return Routes.slice()
      },
      cleanRoutes: function cleanRoutes() {
        return navigator.reset()
      },
    }
  },
}

export default index
```
