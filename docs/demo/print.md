> 作者：绯影

1. @media 下设置样式
2. 使用 mm
3. imgBox 设置在 div 上
4. page-break-after: always; 设置分页

```vue
<template>
  <div class="print_tag">
    <!-- <img class="imgBox" v-for='(item,index) in urls' :key='index' :width="calWidth(item.width) + 'px'" :src="item.url" alt=""> -->
    <!-- :class="index === collect.length - 1 ? 'last-child' : 'imgBox'" -->
    <div>
      <div
        v-for="(item, index) in list"
        :key="index"
        class="imgBox"
        :style="{
          width: `${width_space.total_width}mm`,
        }"
      >
        <img
          v-for="(img, index1) in item"
          :key="index1"
          :src="img"
          alt=""
          :style="{
            width: `${width_space.width}mm`,
            height: `${width_space.height - 0.1}mm`,
            'margin-right': `${
              index1 < item.length - 1 ? width_space.space : 0
            }mm`,
          }"
        />
      </div>

      <!-- <div
        class="imgBox"
        v-for="(item, index) in urls"
        :key="index"
        :style="{
          'margin-right': `${
            (index + 1) % setting.cols ? width_space.space : 0
          }mm`,
        }"
        v-html="item.url"
      ></div> -->
    </div>
  </div>
</template>

<script>
import { getDeviceXDPI, mmToPx } from '@/util/exportFuncs'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      urls: [],
      setting: { cols: 1, space: 5 },
      list: [],
      needTranslate: false,
      needScale: true,
      scale: 1,
      dpi: getDeviceXDPI(),
    }
  },
  methods: {
    goBack() {
      setTimeout(() => {
        this.$router.push({
          path: '/printTag',
        })
      }, 200)
    },
    translateFn(val) {
      let result
      if (this.needTranslate) {
        result = mmToPx(val, this.dpi)
      } else {
        result = val
      }
      if (this.needScale) {
        return result * this.scale
      }
    },
  },
  mounted() {
    let len = this.$store.state.tagValue.length
    if (len) {
      this.urls = this.$store.state.tagValue
      this.setting = this.$store.state.tagPrintSetting
      //   console.log("this.setting", this.setting);
      let cols = this.setting.cols || 1

      let arr = []
      this.collect.forEach((item) => {
        arr.push(item)
        if (arr.length === cols) {
          this.list.push(arr)
          arr = []
        }
      })
      if (arr.length) {
        this.list.push(arr)
      }
      //   console.log("this.list", this.list);
      //   console.log("this.collect", this.collect);
      //   console.log("cols", cols);

      setTimeout(() => {
        window.print()
      }, 100)
    } else {
      this.goBack()
    }
    window.onafterprint = this.goBack
  },
  computed: {
    ...mapState(['collect']),
    calWidth() {
      return (value) => {
        return Math.floor(+value) - 1
      }
    },
    // collect() {
    //   return this.$store.collect;
    // },
    width_space() {
      let scale = 1 || this.$route.query.scale
      console.log('scale', scale)
      console.log('原始宽度', this.urls[0].width)
      console.log('原始高度', this.urls[0].height)
      if (!this.urls.length) return { total_width: 0, space: 0 }
      // let dpi = getDeviceXDPI();
      // console.log("dpi", dpi);
      //   let tag_width = mmToPx(this.urls[0].width, dpi) * scale;
      //   let tag_height = mmToPx(this.urls[0].height, dpi) * scale;

      let tag_width = this.translateFn(this.urls[0].width)
      let tag_height = this.translateFn(this.urls[0].height)
      //   console.log("转换后宽度", tag_width);
      //   console.log("转换后高度", tag_height);
      //   let space = mmToPx(this.setting.col_space, dpi);
      //   return {
      //     total_width:
      //       tag_width * this.setting.cols + space * (this.setting.cols - 1) + 1,
      //     space,
      //   };
      //   let space = mmToPx(this.setting.col_space, dpi) * scale;
      let space = this.translateFn(this.setting.col_space)
      //   let total_width =
      //     mmToPx(
      //       this.urls[0].width * this.setting.cols +
      //         this.setting.col_space * (this.setting.cols - 1),
      //       dpi
      //     ) * scale;
      let total_width = this.translateFn(
        this.urls[0].width * this.setting.cols +
          this.setting.col_space * (this.setting.cols - 1)
      )

      const result = {
        total_width: total_width,
        width: tag_width,
        space,
        height: tag_height,
      }
      return result
    },
  },
}
</script>

<style>
.imgBox {
  display: block;
  overflow: hidden;
  /* margin: 0 0 20px; */
}
.print_tag {
  font-size: 0 !important;
  display: none;
}

@media print {
  .print_tag {
    display: block !important;
  }
  .imgBox {
    display: block !important;

    page-break-after: always;
    margin: 0 !important;
    padding: 0 !important;
  }
  .imgBox img {
    box-sizing: border-box !important;
    /* border: solid 1px red; */
  }
  .imgBox:last-child {
    page-break-after: auto !important;
  }
}
@page {
  margin: 0mm 0mm 0mm 0mm !important;
  /* size: auto;
  margin: 0; */
}
</style>
```
