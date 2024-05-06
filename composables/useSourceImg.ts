export const useSourceImg = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    
    const retrieveUrl = () =>{
        
        if(!user.value?.user_metadata?.avatar_img) return 'https://avatars.githubusercontent.com/u/739984?v=4'
        const {data} = supabase.storage.from('Avatars').getPublicUrl(user.value?.user_metadata.avatar_img)
        
        return data.publicUrl
    } 
    const source = ref<string>(retrieveUrl())
    watch(user, () => source.value = retrieveUrl(), {immediate: true})


    return source

    
}