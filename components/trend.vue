<template>
    <div>
        <div class="font bold" :class="[color]">{{ title }}</div>
        <div class="text-2xl font-bold text-black dark:text-white mb-2">
            <USkeleton class="h-8 w-full" v-if="loading" />
            <div v-else>{{ currency }}</div>
        </div>
        <div>
            <USkeleton class="h-6 w-full" v-if="loading" />
            <div v-else class="flex space-x-1 items-center text-sm">
                <UIcon :name="iconChange" class="w-6 h-6"
                    :class="{ 'green': trendUp, 'red': trendDown, 'blue': !trendUp && !trendDown}" />
                <div class="text-gray-500">{{ perDifference }}% vs last period</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type componentProps } from '~/types';
const props = defineProps<componentProps>()
const { amount } = toRefs(props)

const trendUp = computed<boolean>(
    () => props.amount >= props.lastAmount
)


const trendDown = computed<boolean>(
    () => props.amount <= props.lastAmount
)

const iconChange = computed(() => {
    if(trendUp.value) return 'i-heroicons-arrow-trending-up'
    else if(trendDown.value) return'i-heroicons-arrow-trending-down'
    else return'i-heroicons-arrow-long-right'
})
    
const perDifference = computed(() => {
    
    if(props.amount === 0 || props.lastAmount === 0) return 0

    const max = Math.max(props.amount, props.lastAmount)
    const min = Math.min(props.amount, props.lastAmount)
    const ratio = ((max - min) / min) * 100
    
    return Math.ceil(ratio)
})


const { currency } = useCurrency(amount)
</script>

<style scoped>
.green {
    @apply text-green-600
}

.red {
    @apply text-red-600
}

.blue {
    @apply text-blue-600
}
</style>