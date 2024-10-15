<template>
    <UCard v-if="!success">
        <template #header>
            Sign In to Finance Tracker App
        </template>
        <form @submit.prevent="login">
            <UFormGroup label="Email" :required="true" class="mb-10" help="You will receive a confirmation email">
                <UInput type="email" placeholder="Email Address" v-model="email" required></UInput>
            </UFormGroup>
            <UButton type="submit" color="green" variant="solid" :loading="pending" :disabled="pending">Login</UButton>
        </form>
    </UCard>
    <UCard v-else>
        <template #header>
            We sent a confirmation link to your email
        </template>
        <div class="text-center">
            <p class="mb-4">We have sent an email to <strong>{{ email }}</strong> with a link to sign-in.</p>
            <p>
                <strong>Important:</strong> The link will expire in 5 minutes.
            </p>
        </div>
    </UCard>

</template>


<script lang="ts" setup>
const success: Ref<boolean> = ref(false)
const email: Ref<string> = ref('')
const pending: Ref<boolean> = ref(false)
const supabase = useSupabaseClient()
const {toastError} = useAppToast()
const configUrl = useRuntimeConfig()

useUserLogin()


const login = async () => {
    pending.value = true
    try {
        const {error} = await supabase.auth.signInWithOtp({
            email: email.value,
            options: {
                emailRedirectTo: `${configUrl.public.baseUrl}/confirmation`
            }
        })

        if (error) {
            toastError({
                title: 'Invalid Details',
                description: error.message
            })
        } else {
            success.value = true
        }
    } finally {
        pending.value = false
    }
}

</script>

<style></style>