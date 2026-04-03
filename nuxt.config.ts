export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [['@nuxt/ui', {
    input: {
      base: '',
      // ... other input properties like 'wrapper', 'icon', etc.
      variant: {
        sonship: 'w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-tertiary font-body text-sm placeholder-tertiary/40 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
      }
    }
  }], '@nuxtjs/tailwindcss', ['@nuxtjs/i18n', {
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
  }], '@pinia/nuxt'],
  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    registrationEmailFrom: process.env.REGISTRATION_EMAIL_FROM,
    registrationEmailReplyTo: process.env.REGISTRATION_EMAIL_REPLY_TO,
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
    }
  },
  components: [
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/components', ignore: ['ui/**'] },
  ],
  css: ['~/assets/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devServer: {
    port: 5173,
  },
  routeRules: {
    '/login': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/dashboard': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/profile': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/friends': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/games': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/messages': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/schedule': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/gallery': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/letters/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/admin/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    }
  },
  vite: {
    server: {
      allowedHosts: ["firelight.com.my"],
    },
  }
})
