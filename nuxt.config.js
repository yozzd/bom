export default {
  server: { host: '0.0.0.0', port: 5000 },

  head: {
    title: 'BOM',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  css: [
    '@/assets/css/variables.scss',
    '@/assets/css/variables.less',
    '@/assets/css/style.css',
  ],

  plugins: [
    '@/plugins/auth',
    '@/plugins/element-ui',
    '@/plugins/view-ui',
    { src: '@/plugins/oh-vue-icons', mode: 'client' },
  ],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    'nuxt-windicss',
    '@nuxtjs/composition-api/module',
  ],

  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
    '@nuxtjs/style-resources',
    'vue-currency-filter/nuxt',
  ],

  apollo: {
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network',
      },
    },
    clientConfigs: {
      default: '@/apollo/client/default.js',
    },
    tokenName: 'bom-apollo-token',
    errorHandler: '@/apollo/error-handler.js',
  },

  styleResources: {
    scss: [
      '@/assets/css/variables.scss',
    ],
    less: [      
      '@/assets/css/variables.less',
    ],
  },

  currencyFilter: [
    {
      symbol: '',
      thousandsSeparator: ',',
      fractionCount: 2,
      fractionSeparator: '.',
      symbolPosition: 'front',
      symbolSpacing: true,
      avoidEmptyDecimals: '',
    },
  ],

  build: {
    transpile: [
      /^element-ui/,
      'oh-vue-icons',
    ],
    loaders: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          math: 'always',
        },
      },
    },
  },
};
