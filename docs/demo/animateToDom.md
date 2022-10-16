> 作者：绯影

该 demo 是实现当滚动到对应的 dom 时，dom 的动画才开始出现

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <!-- <script src="./fn.js"></script> -->
    <style>
      @keyframes flade {
        0% {
          opacity: 0;
          transform: translateY(100px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .box > div {
        margin-bottom: 500px;
        width: 100px;
        height: 100px;
        background-color: red;
      }
    </style>
  </head>

  <body>
    <div class="box">
      <div class="test1"></div>
      <div class="test2"></div>
      <div class="test3"></div>
      <div class="test4"></div>
      <div class="test5"></div>
      <div class="test6"></div>
      <div class="test7"></div>
    </div>
  </body>
</html>

<script>
  let btn = document.querySelector('button')
  let test1 = document.querySelector('.test1')
  let test2 = document.querySelector('.test2')
  let test3 = document.querySelector('.test3')
  let test4 = document.querySelector('.test4')
  let test5 = document.querySelector('.test5')
  let test6 = document.querySelector('.test6')
  let test7 = document.querySelector('.test7')
  class Animate {
    constructor() {
      this.elementArr = []
      this.immediate = true
      this.timer = null
    }
    add(element, animateName, time = 2) {
      this.elementArr.push(element)
      element.style.visibility = 'hidden'
      element.animateName = animateName
      element.time = time
    }
    scrollFn() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.calcu()
      }, 10)
    }
    calcu() {
      if (this.elementArr && this.elementArr.length === 0) {
        return
      }
      this.elementArr.forEach((element) => {
        // 当前显示页面的高度
        let pageHeight =
          document.documentElement.clientHeight || document.body.clientHeight
        // console.log('pageHeight', pageHeight)
        // 页面卷去的高度
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop
        // 相对于页面顶部的高度
        let top =
          element.getBoundingClientRect && element.getBoundingClientRect().top
        // console.log('top', top)

        // 此时说明element已经出现在页面中了
        if (0 < top && top < pageHeight) {
          element.style.animation = `${element.animateName} ${element.time}s linear`
          element.style.visibility = 'visible'
          element.hasVisibible = true
        }
      })
      let flag = 0
      if (this.elementArr.length) {
        flag = 1
      }
      this.elementArr = this.elementArr.filter((item) => {
        return !item.hasVisibible
      })
      // console.log('这儿是calcu里面的this.elementArr', this.elementArr)
      if (this.elementArr.length === 0 && flag) {
        this.clear()
      }
    }
    start() {
      Animate.tempFn = this.scrollFn.bind(this)
      this.calcu()
      window.addEventListener('scroll', Animate.tempFn)
    }
    clear() {
      window.removeEventListener('scroll', Animate.tempFn)
    }
  }

  let animate = new Animate()
  animate.add(test1, 'flade')
  animate.add(test2, 'flade')
  animate.add(test3, 'flade')
  animate.add(test4, 'flade')
  animate.add(test5, 'flade')
  animate.add(test6, 'flade')
  animate.add(test7, 'flade')
  animate.start()
  // addAnimate(test2, 'flade')
</script>
```
