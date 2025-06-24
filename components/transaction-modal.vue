<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header>
                {{ isEditing() ? 'Edit' : 'Add' }} Transaction
            </template>
            <UForm :state="state" :schema="schema" ref="form" @submit="submitForm">
                <UFormGroup label="Amount" :required="true" name="amount" class="mb-10">
                    <UInput type="text" placeholder="Enter the amount" v-model="state.amount">
                        <template #trailing>
                            <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
                        </template>
                    </UInput>
                </UFormGroup>
                <UFormGroup label="Transaction Date" :required="true" name="created_at" class="mb-10">
                    <UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
                </UFormGroup>
                <UFormGroup label="Type of Transaction" :required="true" name="type" class="mb-10">
                    <USelect :options="types" icon="i-heroicons-magnifying-glass-20-solid"
                        placeholder="Type of Transaction" v-model="state.type" :disabled="!!isEditing()" />
                </UFormGroup>
                <UFormGroup label="Description" hint="Optional" name="description" class="mb-10">
                    <UInput placeholder="Description" v-model="state.description" />
                </UFormGroup>
                <UFormGroup label="Category" :required="true" name="category" class="mb-10"
                    v-if="state.type === 'Expense'">
                    <USelect placeholder="Category" :options="category" v-model="state.category" />
                </UFormGroup>
                <UButton type="submit" color="green" variant="solid" label="Save" :loading="isLoading" />
            </UForm>
        </UCard>
    </UModal>
</template>

<script lang="ts" setup>
import { types, category } from '~/constants'
import { z } from 'zod'


const props = defineProps({
    modelValue: Boolean,
    transaction: {
        type: Object,
        required: false
    }
})


const emit = defineEmits(['update:modelValue', 'saved'])
const isEditing = ref(() => props.transaction)

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) resetForm()
        emit('update:modelValue', value)
    }
})
const defaultSchema = z.object({
    amount: z.string().transform((input) => parseFloat(input)).refine((value) => !isNaN(value) && value > 0, {message: "Invalid Number"}),
    created_at: z.string(),
    description: z.string().optional(),
})

const form = ref()
const isLoading = ref(false)
const incomeSchema = z.object({
    type: z.literal('Income')
})


const supabase = useSupabaseClient()
const { toastSuccess, toastError } = useAppToast()

const expenseSchema = z.object({
    type: z.literal('Expense'),
    category: z.enum(category)
})
const investmentSchema = z.object({
    type: z.literal('Investment')
})
const savingSchema = z.object({
    type: z.literal('Saving')
})

const schema = z.intersection(
    z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
    defaultSchema
)

const submitForm = async () => {


    if (form.value.errors.length) return
    try {
        const {error } = await supabase.from('transactions').upsert({
            id: props.transaction?.id, ...state.value
        } as any).select()
        isLoading.value = true

        if (error) throw new Error(error.message)
        if (!error) {
            toastSuccess({
                title: "Transaction saved",
            })
            isOpen.value = false
            emit('saved')
            return
        }

    }
    catch (error) {
        if (error instanceof Error) {
            toastError({
                title: "Transaction failed",
                description: error.message,
            })

        }
    }
    finally {
        isLoading.value = false
    }
}

const initialState = isEditing ? {
    amount: props.transaction?.amount,
    created_at: props.transaction?.created_at.split('T')[0],
    type: props.transaction?.type,
    description: props.transaction?.description,
    category: props.transaction?.category
} :  {
    amount: 0,
    created_at: undefined,
    type: undefined,
    description: undefined,
    category: undefined
}

const state = ref({ ...initialState })


const resetForm = () => {
    Object.assign(state.value, initialState)
    form.value.clear()
}



</script>

<style scoped></style>