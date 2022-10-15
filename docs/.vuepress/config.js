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
  locales: {
    '/': {
      lang: 'zh-CN', // 可以保证 date 显示按照年/月/日进行显示
    },
  },
  themeConfig: {
    // displayAllHeaders: false,
    sidebarDepth: 0,
    lastUpdated: '上次更新', // 默认是关闭的，在给定一个字符串后，它会作为前缀显示
    subSidebar: 'auto', // 将多级标题放在右侧，生成子侧边栏
    // 设置导航栏
    nav: [
      { text: 'github', link: 'https://github.com/tfeng-use' },
      {
        text: '博客',
        items: [
          { text: 'Github', link: 'https://github.com/mqyqingfeng' },
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
        // path: '/',
        collapsable: false,
        children: [{ title: '学前必读', path: '/' }],
      },
      {
        title: '前端面试',
        // path: '/handbook/ConditionalTypes',
        collapsable: false,
        children: [
          { title: 'http', path: '/handbook/http' },
          { title: '泛型', path: '/handbook/Generics' },
        ],
      },
      {
        title: '技能树',
        // path: '/handbook/ConditionalTypes',
        collapsable: false,
        children: [{ title: '条件类型', path: '/newTechTree/1' }],
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
