<template>
  <div class="grid grid-cols-6 gap-8">
    <UVerticalNavigation :links="links" class="cols-span-2" />
      <div class="cols-span-4">
        <NuxtPage />
      </div>
  </div>
</template>

<script lang="ts" setup>

const links = [
  {
    label: "Profile",
    to: '/settings/profile' 
  },
  {
    label: "Avatar",
    to: '/settings/avatar' 
  },
  {
    label: "Preferences",
    to: '/settings/preferences' 
  }
]

</script>
<style>

</style>