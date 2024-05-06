// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    port: 5006
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
      baseUrl: process.env.BASE_URL
    }
  },  
})

