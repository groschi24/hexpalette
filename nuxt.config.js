export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Hexpalette - Join the community of color enthusiasts',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Get inspired by color palettes from the community or create the perfect palette for you.',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'hexpalette, colors, color, hex, hex color, rgb color, palette, color palette, palette color, colour palette, colour, color schemes',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        'data-ad-client': 'ca-pub-2189427448964686',
        async: true,
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/style.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/axios-accessor' },
    { src: '~/plugins/vue-lazyload', mode: 'client' },
    { src: '~/plugins/vuex-persist', mode: 'client' },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/vue-toast' },
    { src: '~/plugins/vuedraggable' },
    { src: '~/plugins/infiniteloading', mode: 'client' },
    { src: '~/plugins/vue-color', mode: 'client' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/moment',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-124025931-10',
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap', // Sitemap has to be on the end of this array
  ],
  /*
   ** Sitemap
   */
  sitemap: {
    hostname: 'https://hexpalette.com',
    exclude: [
      '/collections',
      '/collections/**',
      '/service',
      '/service/**',
      '/palette',
    ],
  },
  /*
   ** Robots
   */
  robots: [
    {
      UserAgent: '*',
      Disallow: '/collections',
    },
    {
      UserAgent: '*',
      Disallow: '/service',
    },
    {
      UserAgent: '*',
      Disallow: '/palette',
    },
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  moment: {},
  tailwindcss: {
    // add '~tailwind.config` alias
    exposeConfig: true,
  },
  purgeCSS: {
    whitelist: ['dark-mode'],
  },
  googleFonts: {
    families: {
      Inter: {
        wght: [400, 700, 800, 900],
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    analyze: false,
    transpile: ['vee-validate/dist/rules'],
  },
  env: {
    apiUrl: 'https://api.hexpalette.com/api',
  },
};
