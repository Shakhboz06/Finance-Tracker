<template>
  <UForm :state="state" :schema="schema" @submit="saveSettings" class="w-96">
    <UFormGroup label="Transaction View" class="mb-4" help="Choose how you would like to view transactions">
      <USelect v-model="state.transactionView" :options="options" />
    </UFormGroup>

    <UButton type="submit" color="green" variant="solid" label="Save" :loading="pending" :disabled="pending" />
  </UForm>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import { options } from '~/constants'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)

const state = ref({
  transactionView: user.value?.user_metadata.transaction_view ?? options[0]
})
const schema = z.object({
  transactionView: z.enum(options as [string, ...string[]])
})

const saveSettings = async () => {
  pending.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.value.transactionView
      }
    })

    if (error) throw new Error(error.message)
    toastSuccess({
      title: 'Preferences successfully set'
    })

  } catch (error) {
    if (error instanceof Error) {
      toastError({
        title: 'Error updating settings',
        description: error.message,
      });
    } else {
      toastError({
        title: 'Error updating settings',
        description: 'An unexpected error occurred',
      });
    }
  } finally {
    pending.value = false
  }
}
</script>