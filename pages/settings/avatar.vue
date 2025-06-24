<template>
    <div class="w-max">
        <div class="mb-4">
            <UFormGroup label="Current avatar" class="w-full">
                <UAvatar :src="source" size="3xl" />
            </UFormGroup>
        </div>

        <div class="mb-4">
            <UFormGroup label="New avatar" class="w-full" name="avatar"
                help="After choosing an image click Save to actually upload the new avatar">
                <UInput type="file" ref="fileInput" />
            </UFormGroup>
        </div>

        <UButton type="submit" color="green" variant="solid" label="Save" :loading="uploading" :disabled="uploading"
            @click="saveAvatar" />
    </div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const source = useSourceImg()
const { toastSuccess, toastError } = useAppToast()

const uploading = ref(false)
const fileInput = ref()
const saveAvatar = async () => {
    const file = fileInput.value.input.files[0]
    
    if (!file) {
        toastError({
            title: 'Please upload a file first!',
        })
        return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`

    try {
        uploading.value = true
        const currentUrl = user.value?.user_metadata?.avatar_img
        const { error } = await supabase.storage.from('avatars').upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        })
        if (error) throw new Error(error.message)
        await supabase.auth.updateUser({ data: { avatar_img: fileName } })
        if (currentUrl) {
            const { error } = await supabase.storage.from('avatars').remove([currentUrl])
            if (error) throw new Error(error.message)
        }
        fileInput.value.input.value = null

        toastSuccess({
            title: 'Avatar uploaded',
        })

    } catch (error) {
        if (error instanceof Error) {
            toastError({
                title: 'Error uploading an image',
                description: error.message,
            })
        } else {
            toastError({
                title: 'User Update Failed',
                description: 'An unexpected error occurred',
            })
        }
    } finally {
        uploading.value = false
    }
}

</script>