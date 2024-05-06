<template>
    <div>
        <UCard>
            <template #header>
                Signing in.....
            </template>
            Wait a moment while we sign you in....
        </UCard>
    </div>
</template>

<script lang="ts" setup>
setTimeout(() => {
    useUserLogin()
}, 100);

</script>

<style></style>