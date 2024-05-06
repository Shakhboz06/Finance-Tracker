<template>
    <div class="grid grid-cols-3 py-2 border-b">
        <div class="flex items-center justify-between space-x-4 col-span-2">
            <div class="flex items-center space-x-2">
                <UIcon :name="indicator"
                    :class="{ 'text-green-600': props.transaction.type == 'Income', 'text-red-600': props.transaction.type == 'Expense' }" />
                <div>{{ transaction.description }}</div>
            </div>
            <UBadge color="white" v-if="transaction.type == 'Expense'">{{ transaction.category }}</UBadge>
        </div>
        <div class="flex items-center justify-end space-x-6">

            <div>{{ currency }}</div>
            <div>
                <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
                    <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal"
                        :loading="isLoading" />
                    <TransactionModal v-model="isOpen" :transaction="props.transaction" @saved="$emit('edited')" />
                </UDropdown>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type transaction } from '~/types/transaction';

const props = defineProps<{
    transaction: transaction
}>()

const emit = defineEmits(['deleted', 'edited'])
const isOpen = ref(false)
const indicator = computed(() => {
    if (props.transaction.type == "Income") return "i-heroicons-arrow-up-right"
    else return "i-heroicons-arrow-down-left"
})
const { currency } = useCurrency(props.transaction?.amount)
const supabase = useSupabaseClient()
const isLoading = ref(false)
const { toastSuccess, toastError } = useAppToast()


const deleteTransaction = async () => {
    isLoading.value = true
    try {
        await supabase.from('Transactions').delete().eq('id', props.transaction.id)
        toastSuccess({
            title: 'Deleted Successfully',
        })
        emit('deleted', props.transaction.id)
    } catch {
        toastError({
            title: 'Deletion was not successfull',
        })
    } finally {
        isLoading.value = false
    }
}
const items = [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => isOpen.value = true
        },
        {
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid',
            click: deleteTransaction
        }
    ]
]


</script>

<style></style>