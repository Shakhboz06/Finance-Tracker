<template>
    <div class="w-96">
        <UForm :state="state" :schema="schema" @submit="updateUser">
            <UFormGroup label="Full Name" class="mb-4" name="name">
                <UInput v-model="state.name" type="text" :required="true" />
            </UFormGroup>
            <UFormGroup label="Email" class="mb-4" name="email"
                help="You will receive a confirmation email on both of your old and new email address">
                <UInput v-model="state.email" type="email" :required="true" />
            </UFormGroup>

            <UButton label="Change" color="green" variant="solid" type="submit" :loading="pending"
                :disabled="pending" />
        </UForm>
    </div>
</template>

<script lang="ts" setup>
import {z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)
const state = ref({
    name: user.value?.user_metadata?.full_name,
    email: user.value?.email
})

const schema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email()

})

const updateUser = async () => {
    pending.value = true

    const data = {
        data: {
            full_name: state.value.name
        },
        email: ''
    }

    if(state.value.email && user.value?.email && state.value.email !== user.value.email){
        data.email = state.value.email
    }
    try {
        const { error } = await supabase.auth.updateUser(data)
        if (error) throw new Error(error.message)

        toastSuccess({
            title: 'User Update Successfull',
            description: 'Your profile has been updated'
        })
    } catch (error) {
        if (error instanceof Error) {
            toastError({
                title: 'User Update Failed',
                description: error.message,
            })
        } else {
            toastError({
                title: 'User Update Failed',
                description: 'An unexpected error occurred',
            })
        }
    } finally {
        pending.value = false
    }
}
</script>

<style></style>