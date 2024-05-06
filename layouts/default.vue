<template>
    <div class="container mx-auto max-w-4xl">
        <Header />
      <main class="my-10">
        <slot />
      </main>
    </div>
  </template>
  
  <script lang="ts" setup>
  useHead({
    title: 'Finance Tracker',
    link: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
        crossorigin: ''
      }
    ]
  })
  </script>
  
  <style>
  body {
    font-family: 'Inter';
  }
  body {
    @apply dark:bg-gray-900 bg-white
  }
  </style>