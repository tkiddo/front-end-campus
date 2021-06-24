module.exports = {
  title: '唐凯强的网络博客', // Title for the site. This will be displayed in the navbar.
  theme: '@vuepress/theme-blog',
  themeConfig: {
    // Please keep looking down to see the available options.
    repo: 'tkiddo/front-end-campus',
    repoLabel: 'Github',
    nav: [
      {
        text: '博客',
        link: '/'
      },
      {
        text: '标签',
        link: '/tag/'
      },
      {
        text: 'Github',
        link: 'https://github.com/tkiddo/front-end-campus'
      }
    ]
  },
  base: '/front-end-campus/'
};
