// import recoTheme from 'vuepress-theme-reco'

module.exports = {
  title: '面试知识点',
  description: '记录前端面试中比较重要的知识点',
  // theme: 'reco',
  base: '/myBlog/', // 由于项目的根地址是：https://tfeng-use.github.io/myBlog/，所以必须加上base才整正确访问到对应的assets资源

  locales: {
    '/': {
      lang: 'zh-CN', // 可以保证 date 显示按照年/月/日进行显示
    },
  },
  themeConfig: {
    // displayAllHeaders: false,
    sidebarDepth: 0,
    lastUpdated: '上次更新', // 默认是关闭的，在给定一个字符串后，它会作为前缀显示
    // subSidebar: 'auto', // 将多级标题放在右侧，生成子侧边栏
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
        title: '欢迎学习',
        // path: '/',
        collapsable: false,
        children: [{ title: '学前必读', path: '/' }],
      },
      {
        title: '基础学习',
        // path: '/handbook/ConditionalTypes',
        collapsable: false,
        children: [
          { title: '条件类型', path: '/handbook/ConditionalTypes' },
          { title: '泛型', path: '/handbook/Generics' },
        ],
      },
    ],
  },
}
