export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', '@nuxtjs/i18n', 'nuxt-vuefire', '@pinia/nuxt'],
  components: [
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/components', ignore: ['ui/**'] },
  ],
  tailwindcss: {
    cssPath: '~/assets/main.css',
    configPath: '~/tailwind.config.js',
  },
  css: ['~/assets/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vuefire: {
    config: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    },
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'zh',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '繁體中文' },
    ],
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'sonship-locale',
      redirectOn: 'root',
    },
  },
  devServer: {
    port: 5173,
  },
  vite: {
    server: {
      allowedHosts: ["902a-202-184-126-151.ngrok-free.app"],
    },
  },
  ui: {
    input: {
      base: '',
      // ... other input properties like 'wrapper', 'icon', etc.
      variant: {
        sonship: 'w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-tertiary font-body text-sm placeholder-tertiary/40 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
      }
    }
  }
})
