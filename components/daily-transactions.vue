<template>
    <div class="grid grid-cols-2 py-2 border-b">
        <div class="flex items-center justify-between text-gray-500">
    {{ formattedDate }}
        </div>
        <div class="flex items-center justify-end text-gray-500">
            {{ currency }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { format, parseISO } from 'date-fns';
import { type transaction } from '~/types/transaction';

const props = defineProps<{
    date: string,
    transaction: transaction[]
}>()
const formattedDate = ref(format(parseISO(props.date), 'dd.MM.yyyy'))
const sum = computed(() => {
    let sum = 0
    for(const item of props.transaction){
        if(item.type === "Income")sum += item.amount
        else sum -= item.amount
    }

    return sum
})

const {currency} = useCurrency(sum)
</script>

<style></style>