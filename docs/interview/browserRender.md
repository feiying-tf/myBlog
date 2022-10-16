1. 构建 DOM 对象
   `html --> dom`
2. 构建 CSSOM 对象
   `css -> cssom`
3. 渲染树，要显示的留下，不显示的去掉
   `dom + cssDom --> render tree`
4. 布局和绘制
   （1）布局：计算每个节点精确的位置和大小
   （2）绘制：像素化每个节点的过程
5. 合成
   将 layers 合成图片
