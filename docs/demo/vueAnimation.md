> 作者：绯影

1. 方案 1

```html
<router-wrap :keyFlag="key">
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <component :is="Component" />
    </transition>
  </router-view>
</router-wrap>

//------
<script>
  export default {
    name: 'RouterWrap',
    render() {
      let vnodeList = this.$slots.default ? this.$slots.default() : null
      let vnode = vnodeList[0]
      for (let i = 0; i < vnodeList.length; i++) {
        // 去掉注释的情况
        if (vnodeList[i].type.description !== 'Comment') {
          vnode = vnodeList[i]
          break
        }
      }
      vnode.key = this.keyFlag
      console.log('this.keyFlag', this.keyFlag)
      return vnode
    },
    props: {
      keyFlag: String,
    },
  }
</script>
```
