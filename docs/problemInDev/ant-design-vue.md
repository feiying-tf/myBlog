> 作者：绯影

1. ant-design-vue 使用 this.$refs.xxx.validate() 验证的时候，如果没有触发回调，那么很有可能是 rules 里面的验证函数出错了，应该仔细检查验证函数。
2. 人民币符号 &yen;
3. 、modal 设置按钮 loading

```
:ok-button-props="{ props: { loading: btnLoading } }"
```

5. 使用 ant-design-vue 的时候最好不要在一个 validator 里面对不同的属性进行验证，如果有这种情况，那么就分开写。
6. 如果 ant-design-vue 表单的 input 框后缀位置发生变化，那么说明肯定是验证出了问题，那么将该属性对应的验证单独抽出来。
7. 在使用 table 的时候，fixed 必须具体执行 'left'或者 'right'，如果设置了 left，那么其他的项最好不要设置具体宽度，否则容易出问题。
8. input 上传垛长图片完成后再次上传注意清空 input

```js
this.$refs.oInput.value = ''
```

10. 在 table 中的 fixed 列，如果使用 popover 传入了`trigger="focus"`，那么结果就是会产生两个 popover，因为 fixed 的实质就是将最后一列产生一个副本。解决方法如下

```vue
<template>
  <a-popover v-model="record.showPop" trigger="1234">
    <div slot="content">
      <li
        class="order-state-item"
        v-for="(item, index1) in $table.rechargeRegisterArr"
        @click.stop.prevent="handleChangeItem(item.value, index)"
        :key="index1"
      >{{item.title}}</li>
    </div>
    <span class="change" style="cursor: pointer" @click.stop.prevent=handleClickActionContent(record)">
      {{$table.rechargeRegisterEnum[record.status]}}
      <a-icon class="fs12" type="down" />
    </span>
  </a-popover>
</template>
<script>
export default {
  methods: {
    handleClickActionContent (record) {
      this.$set(record, 'showPop', !record.showPop)
    }
  }
}
</script>

```

（1）trigger 传入一个任意值，通过内容的点击控制 popover 的显示隐藏（不要用默认的属性）  
（2）给 body 增加一个 `overflow: hidden` 防止 popOver 产生副本的时候页面出现滚动条  
（3）计算当前页面下所有的内容距离左边的距离，将距离大的那个元素给隐藏掉

```js
if (record.showPop) {
  setTimeout(() => {
    const elements = document.querySelectorAll('.ant-popover')
    if (this.minLeft === Infinity) {
      elements.forEach((ele, index) => {
        const left = parseInt(ele.style.left)
        this.minLeft = left > this.minLeft ? this.minLeft : left
      })
    }
    elements.forEach((ele, index) => {
      if (parseInt(ele.style.left) === this.minLeft) {
        ele.style.visibility = 'visible'
      } else {
        ele.style.display = 'none'
      }
    })
  }, 20)
}
```

（4）如果点击其中一个想要其他所有的都关闭，可以在点击后的函数里面执行下面的代码

```js
const showPop = record.showPop
// 首先将所有的都给取消掉
this.$refs.table.resetListShowPop()
this.$set(record, 'showPop', !showPop)
```

（5）为了避免 popover 一直固定，可以监听页面的滚动事件，以滚动就隐藏掉

```js
window.onmousewheel = document.onmousewheel = scrollFunc


scrollFunc () {
  if (this.$refs.table) {
    this.$refs.table.resetListShowPop()
  }
}
```

11. upload 上传

- 按照顺序上传
  在 beforeUpload 里面用数组保存每一个上传文件的信息（这里面获取的文件数组是按顺序的）msgList，加上标识符，比如 uid。
- 在上传成功以后，通过当前 file.uid 与 msgList 里面的内容进行比较，找到对应的 index，然后将当前上传成功对应的 url 保存到 v-model 对应的数组 imgList 对应的索引位置
- 当删除列表中的数据时，标记当前数组的属性

```js
this.imgList.isSelf = true
```

- 在 watch 里面通过 isSelf 判断是外部设置造成的重置还是点删除造成的 imgList 为 []

```js
watch: {
  value: {
    handler (val) {
      // 此时是外部造成的更新，或者初始化
      if (this.imgList.length === 0 || (val.length === 0 && !val.isSelf)) {
        // 对imgList的内容进行重置
        this.imgMsgList = val.map(item => {
            let {
              name,
              suffix
            } = this.$utils.getSourceName(item)
            return {
              name: name + suffix,
              percent: 0,
            }
        })
      }
    }
  }
}
```

11. spa 页面实现 seo  
    采用预渲染的方式 prerender-spa-plugin

```js
// 预渲染
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
```

12. 关键字热度大数据  
    https://data.chinaz.com/keyword/

13. 如果 a-select 的 v-model 无效，那么可以设置 defaultValue，并且通过 change 事件获取点击的值

```vue
<template>
  <a-select
    :key="selectKey"
    style="width: 100%; marginBottom: 20px"
    @change="handleSelectChange"
    :defaultValue="defauleExpectTime"
  >
    <a-select-option
      placeholder="选择时间段"
      :value="item.value"
      v-for="(item, index) in timeOption"
      :key="index"
      >{{ item.title }}</a-select-option
    >
  </a-select>
</template>

<script>
handleSelectChange (value) {
  this.defauleExpectTime = value
  // ...
},
</script>
```

15. a-date-picker 要在里面添加自定义的组件，可以使用 renderExtraFooter

```html
<a-date-picker>
  <div slot="renderExtraFooter">// 这儿里面添加其他自定义组件</div>
</a-date-picker>
```

16. a-date-picker 要显示自定义的内容，比如 `2020-10-19 09:00-12:00` 那么就只能通过 input 框代替，然后将 a-date-picker 进行隐藏，当触发 focus 事件的时候，通过 js 触发 a-date-picker 的显示

```vue
<template>
  <a-form-model-item label="期望收货时间" prop="expectedDeliveryDate">
    <!-- 用一个input框代替日期选择器的显示 -->
    <a-input
      readonly="true"
      placeholder="请选择"
      @focus="expectFocus"
      v-model="form.expectedDeliveryDate"
      class="ant-calendar-picker picker-temp"
    >
      <!-- 模拟清除icon -->
      <a-icon
        class="clear-icon"
        slot="suffix"
        theme="filled"
        type="close-circle"
        @click="handleExpectClear"
      />
      <!-- 模拟日历icon -->
      <a-icon class="date-icon" slot="suffix" type="calendar" />
    </a-input>
    <!-- 真正的时间选择器 -->
    <a-date-picker
      class="expect-date-picker"
      ...
      @change="handleExpectDateChange"
    >
    </a-date-picker>
  </a-form-model-item>
</template>

<!-- style -->
<style>
// 隐藏时间选择器
.expect-date-picker {
  position: absolute;
  left: 0;
  top: -7px;
  z-index: -1;
  opacity: 0;
}
// 设置替换时间选择器的temp
.picker-temp {
  &:hover {
    .date-icon {
      opacity: 0;
    }
    .clear-icon {
      z-index: 10;
      opacity: 1;
    }
  }
  .date-icon,
  .clear-icon {
    color: #ccc;
    position: absolute;
    right: 0px;
  }
  .date-icon {
    opacity: 1;
    transition: all 0.3s;
  }
  .clear-icon {
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s;
    &:hover {
      color: #999;
    }
  }
}
</style>

<!-- js -->
<script>
handleExpectDateChange (date, dateString) {
  this.expectDateString = dateString
  this.form.expectedDeliveryDate = dateString + ' ' + this.defauleExpectTime
}

// focus事件
expectFocus () {
  // 通过js触发时间选择器的点击
  document.querySelector('.expect-date-picker .ant-input').click()
},
</script>
```

17. 通过 js 触发 Upload 组件的点击事件
    editClass 通过时间戳生成，这样就可以保证没有 upload 组件的 editClass 不一样，否则当一个页面引入多个 Upload 组件时，得到文件内容的将是第一个 Upload 组件

```vue
<!-- upload 组件 -->
...其他部分 // a-upload部分
<a-upload ... :class="[editClass]" accept="image/jpeg, image/jpg, image/png">
  <div v-if="imgList.length < maxLength">
    <a-icon type="plus" />
    <div class="ant-upload-text">{{text}}</div>
  </div>
</a-upload>

<!-- js部分 -->
<script>

data () {
  return {
    editClass: 'uploader' + Date.now().toString(32)
  }
}

methods: {
  // 通过js触发upload的click事件
  handleUploadEdit (index) {
    this.currentIndex = index
    document.querySelector(`.${this.editClass} input`).click()
  }
}
</script>
```

18. 通过接口下载文件的方式（涉及到鉴权，所以用接口的方式），使用 fetch

```js
// 请求参数加入
fetchObj.responseType = 'blob'

// 处理获取到的数据
if (fetchObj.responseType === 'blob') {
  response = res.blob()
}

// 下载文件
downCouponExcel(record.batchCode, (res) => {
  console.log('res', res)
  downLoadFile(res, `${record.name}.xlsx`)
})

// 下载文件的方法
export const downLoadFile = function (content, fileName) {
  const blob = new Blob([content])
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  const filename = fileName
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
```

19. 获取一个文件夹下面的所有图片

```js
export const getImgListFromPath = function (type) {
  // context的第一个参数设置为变量会报错
  let req = ''

  switch (type) {
    case 'deliveryCert':
      req = require.context('@/assets/deliveryCert', false, /\.png$/)
      break
    default:
      break
  }

  let arr = []
  // req.keys返回所有的路径
  req.keys().forEach((url) => {
    // 将url传入req，会返回可以直接使用的路径
    arr.push(req(url))
  })
  return arr
}
```

20. 处理密码重置，使用 `a-dropdown` 组件

21. 密码验证

- 原始密码验证：必填
- 新密码验证：格式 + 必填
- 确认密码验证：是否与新密码一致 + 必填
- 新密码与老密码相同：通过接口进行验证

22. table 的嵌套

- 查看 `ant-design-vue` 的 `Table` 中的树形数据展示部分
- 处理每一个 `parent` 和 `child` 的选中效果
  （1）`parent` 选中，`child` 全选  
  （2）`parent` 取消选中，`child` 全部取消  
  （3）`child` 全部选中，`parent` 选择  
  （4）`child` 选中部分，`parent` 半选中状态
- 半选中状态，通过 `ant-checkbox-indeterminate` 类实现
- `child` 里面数据必须包含 `parent` 的唯一索引
- 将选中的 `child` 预计对应的 `parent` 进行记录，最后生成树状结构的时候用
- 首先处理数据，以 `parent` 的唯一 `id` 作为属性就行缓存 `dataMap`
- 同时将包含 `child` 的数组进行打平，以唯一`id`作为 `key` 就行储存 `flatData`
- 为了避免 `child` 与 `parent` 的 `id` 相同，必须对 `child` 的 `id `进一步处理

```javascript
child.id = 'item_' + child.id
```

[参考代码](https://github.com/tfeng-use/files/blob/master/program/management/components/treeTable.vue)

23. ant-design，form 表单，使用 validator 时的验证
    必须使用 callback

```js
validator (rule, value, callback) {
  if (xxx) {
    const str = '请选择付款订单'
    callback(str)
  }
  callback()
}
```
