> 作者：绯影

### 1. vue2 与 vue3 的区别

1. 源码优化

- 更好的代码管理方式：monorepo
- 可以单独引入其中的某个 package，比如：reactivity 进行单独使用，而不用去依赖整个 Vue.js，减小了引用包的体积大小
- 对 typescript 更加友好

2. 性能优化

- 移除一些冷门的 feature，比如 filter、inline-template 等
- tree-shaking 技术
  > 如果你在项目中没有引入 Transition、KeepAlive 等组件，那么它们对应的代码就不会打包
- 数据劫持（使用的 proxy 进行劫持）
  > 1. 可以解决对象添加新属性、数组添加新元素无法监听的问题
  > 2. 在 getter 中去递归响应式，避免 vue2 中的使用 defineProperty 的无脑递归

3. 编译优化

- 编译阶段对静态模板的分析，编译生成了 Block tree，这里面的每个区块通过一个 array 来追踪自身包含的动态节点。

4. 语法 API 优化：Composition API

- 可以很好的解决 mixins 来源不明的问题

### 2. 为什么 slot 里面的内容发生变化以后，component 要重新执行 render？

slot 里面的内容是在子组件执行 render 的时候进行渲染的，所以收集的渲染 effect 就是子组件的 render。所以当值改变时，就会触发子组件的 render 执行。

### 3. vue 的复用策略

### 4. createBlock 的第 4 个参数有什么作用

```javascript
 _createBlock(
    _component_custom_input,
    {
      text: _ctx.searchText,
      "onUpdate:text": ($event) => (_ctx.searchText = $event),
    },
    null,
    8 /* PROPS */,
    ["text", "onUpdate:text"]
  )
);
```

### 5. 为什么有了 vnode 还要有 instance?

vnode 是对节点的抽象，而 instance 是用来维护上下文。只有组件才有实例。

### 6. 为什么 ref 设置的变量在模板里面使用的时候不用加上 value?

- 因为 ref 的数据会在 setup 中的进行返回，所以最终会作为 instance.setupState，当通过 \_ctx.xx 进行访问时，最终会找到 setupState 上面。
- 在 handleSetupResult 里面

```javascript
function handleSetupResult(instance, setupResult, isSSR) {
  // ...
  // 返回的是一个proxy
  instance.setupState = proxyRefs(setupResult)
  // ...
}

function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers)
}

// 这里面会处理ref的情况
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  },
}
```

访问到 ref 的时候，会返回 .value

### 7. transition 内部包含一个自定义的组件时，怎么处理对应的 dom

1. 外面有组件包裹

```javascript
<transition :name="transitionName" appear>
  <router-wrap>
    <div :key="key">
      <component :is="Component" />
    </div>
  </router-wrap>
</transition>
```

mountComponent —> 设置 root.transition = vnode.transition; 即 subtree.transition = vnode.transition，但是 transition 中的 vnode 还是指向 routerWrap

componentUpdateFn 中的 update —>
patch—>
（1）卸载旧的

- unmount(n1) —> remove —> performLeave —> leave（继承的 routerWrap 中的 transition 中包含的 leave），其实是 resolveTransitionHooks —> leave（此时的 vnode 是 routerWrap)

```js
设置el._leaveCb
// 因为routerWrap的key为null，所以此时 leavingVNodesCache 有一个null属性，值为 routerWrap 对应的vnode
leavingVNodesCache[key] = vnode
onLeave-- > nextFrame
```

（2）添加新的

- processElement -->mountElement(n2) --> transition.beforeEnter(继承的 routerWrap 中的 transition 中包含的 beforeEnter，其实是 resolveTransitionHooks 中的 beforeEnter)，在这儿会删除旧 dom 的删除操作

```js
beforeEnter(el) {
  let hook = onBeforeEnter;
  if (!state.isMounted) {
      if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
      }
      else {
          return;
      }
  }
  // for same element (v-show)
  // 新的el._leaveCb此时为空
  if (el._leaveCb) {
      el._leaveCb(true /* cancelled */);
  }
  // for toggled element with same key (v-if)
  // 这儿会获取到routerWrap，因为key为null
  const leavingVNode = leavingVNodesCache[key];
  if (leavingVNode &&
      isSameVNodeType(vnode, leavingVNode) &&
      leavingVNode.el._leaveCb) {
      // force early removal (not cancelled)
      // 执行旧el的_leaveCb() ，会调用remove，直接将dom删除，所以也就等不到在nextFrame中为卸载的dom添加离开样式了
      leavingVNode.el._leaveCb();
  }
  callHook(hook, [el]);
}
```

2. 外面没有组件包裹时

```javascript
<transition :name="transitionName" appear>
    <div :key="key">
      <component :is="Component" />
    </div>
</transition>
```

逻辑和第一点一样，只是在 unmout 旧的节点时 leave 时缓存的 leavingVNodesCache[key] 中的 key 与 beforeEnter 中获取 leavingVNodesCache[key]对应的 key 并不是同一个（因为新生成的 subtree 是 transition 的 render 直接重新生成的，里面包含的.transition 属性也是新的），所以在 beforeEnter 时也就无法删除旧的 dom，那么就可以执行到 nextFrame 中为旧 dom 添加离开的类

3. 前进刷新后退不刷新，兼容动画的最终解决方案就是

```js
<router-view v-slot="{ Component }">
  <transition :name="transitionName" appear>
    <!-- 给 router-wrap 加上key是为了避免在patchElement执行beforeEnter时，通过 leavingVNodesCache[key] 把旧的dom直接给删除，使得离开样式无法生效-->
    <router-wrap :key="key">
      <component :is="Component" />
    </router-wrap>
  </transition>
</router-view>
```
