import Aura from '@primeuix/themes/aura'

// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  nitro: {
    openAPI: {
      meta: {
        title: 'My Awesome Project',
        description: 'This might become the next big thing.',
        version: '1.0',
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/assets/main.css'],
  modules: [
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
    components: {
      exclude: ['Editor', 'Form', 'FormField', 'Chart'],
    },
  },
})
