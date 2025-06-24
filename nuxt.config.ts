// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    port: 3000
  },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  tailwindcss: {
    quiet: true
  },
  supabase: {
    redirect: false
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL ?? 'http://localhost:3000',
    }
  },
})

