// import recoTheme from 'vuepress-theme-reco'
// const path = require('path')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
module.exports = {
  title: '前端知识',
  description: '记录前端面试中比较重要的知识点',
  theme: 'reco', // 使用reco主题
  base: '/myBlog/', // 由于项目的根地址是：https://tfeng-use.github.io/myBlog/，所以必须加上base才整正确访问到对应的assets资源
  // https开启了以后，就不能通过 http://localhost:8080/myBlog/ 直接进行访问了
  // devServer: {
  //   https: true,
  //   key: fs.readFileSync(path.resolve(__dirname, './localhost+1-key.pem')),
  //   cert: fs.readFileSync(path.resolve(__dirname, './localhost+1.pem')),
  // },
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.png',
      },
    ],
  ],
  locales: {
    '/': {
      lang: 'zh-CN', // 可以保证 date 显示按照年/月/日进行显示
    },
  },
  themeConfig: {
    // displayAllHeaders: false,
    sidebarDepth: 0,
    // lastUpdated 默认是关闭的，在给定一个字符串后，它会作为前缀显示，注意这个功能是基于当前文件的commit时间生成的。
    // 所以要想生成时间，必须把当前文件commit 1次，然后重新运行。commit之后再执行 `sh deploy.sh`
    lastUpdated: '上次更新',
    subSidebar: 'auto', // 将多级标题放在右侧，生成子侧边栏
    // 设置导航栏
    nav: [
      { text: 'github', link: 'https://github.com/tfeng-use' },
      {
        text: '博客',
        items: [
          // { text: 'Github', link: 'https://github.com/mqyqingfeng' },
          {
            text: '掘金',
            link: 'https://juejin.cn/user/712139234359182/posts',
          },
        ],
      },
    ],
    // 添加侧边栏
    sidebar: [
      {
        title: '基础知识',
        path: '/base/css',
        collapsable: true,
        children: [
          // { title: '导读', path: '/' },
          { title: 'css', path: '/base/css' },
          { title: '项目相关', path: '/base/project' },
          { title: 'Blob', path: '/base/blob' },
        ],
      },
      {
        title: 'Demo',
        path: '/demo/animateToDom',
        collapsable: true,
        children: [
          { title: '给dom添加动画', path: '/demo/animateToDom' },
          { title: 'vue页面动画', path: '/demo/vueAnimation' },
          { title: '打印方案', path: '/demo/print' },
        ],
      },
      {
        title: '开发中遇到的坑',
        path: '/problemInDev/uniapp',
        collapsable: true,
        children: [
          { title: 'uniapp', path: '/problemInDev/uniapp' },
          { title: 'h5', path: '/problemInDev/h5' },
          { title: 'ant-design-vue', path: '/problemInDev/ant-design-vue' },
        ],
      },
      {
        title: '前端面试',
        collapsable: true,
        path: '/interview/http',
        children: [
          { title: 'http', path: '/interview/http' },
          { title: 'vue-navigation', path: '/interview/vue-navigation' },
          { title: 'vue3', path: '/interview/vue3' },
          { title: 'async+await', path: '/interview/async+await' },
          { title: '前端性能优化', path: '/interview/performanceOpt' },
          { title: '浏览器渲染流程', path: '/interview/browserRender' },
          { title: '版本号管理', path: '/interview/versionNo' },
          { title: '换肤方案', path: '/interview/changeSkin' },
          { title: 'event-loop', path: '/interview/event-loop' },
          { title: '前端存储方案', path: '/interview/web-storage' },
          { title: 'promise', path: '/interview/promise' },
          { title: 'webpack中的hash', path: '/interview/hash' },
          { title: 'h5适配方案', path: '/interview/adaptation' },
        ],
      },
      {
        title: '技能树',
        // path: '/handbook/ConditionalTypes',
        collapsable: true,
      },
    ],
  },
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          const path = require('path')
          moment.locale(lang)
          return moment(timestamp).fromNow()
        },
      },
    ],
    // 自己写的复制组件
    // [
    //   require('./vuepress-plugin-code-copy'),
    //   {
    //     copybuttonText: '复制',
    //     copiedButtonText: '已复制！',
    //   },
    // ],
    // [require('./vuepress-plugin-code-try')],
    [
      require('./vuepress-plugin-nuggets-style-copy'),
      {
        copyText: '复制代码',
        tip: {
          content: '复制成功',
        },
      },
    ],
    [
      'copyright',
      {
        authorName: '绯影', // 选中的文字将无法被复制
        minLength: 30, // 如果长度超过  30 个字符
      },
    ],
    [
      'cursor-effects',
      {
        size: 2, // size of the particle, default: 2
        shape: 'star', // ['star' | 'circle'], // shape of the particle, default: 'star'
        zIndex: 999999999, // z-index property of the canvas, default: 999999999
      },
    ],
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine',
        // options选项中的所有参数，会传给Valine的配置
        options: {
          el: '#valine-vuepress-comment',
          appId: 'Xt9YM70TD44xnEEw7NgBv4NF-gzGzoHsz',
          appKey: '8sA18LdpfWXSUaWjXPo8cmxs',
        },
      },
    ],
  ],
  markdown: {
    extendMarkdown: (md) => {
      md.use(function (md) {
        const fence = md.renderer.rules.fence
        md.renderer.rules.fence = (...args) => {
          let rawCode = fence(...args)
          rawCode = rawCode.replace(
            /<span class="token comment">\/\/ try-link: (.*)<\/span>\n/gi,
            '<a href="$1" class="try-button" target="_blank">Try</a>'
          )
          return `${rawCode}`
        }
      })
    },
  },
}
