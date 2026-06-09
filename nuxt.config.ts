export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
  ],

  app: {
    head: {
      title: 'Wassoh Farm',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Gestion financiere - Wassoh Farm' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  compatibilityDate: '2025-01-01',
})
