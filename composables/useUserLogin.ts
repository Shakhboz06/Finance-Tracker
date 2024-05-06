export const useUserLogin = (defaultUrl: string = '/') => {
    const user = useSupabaseUser()

    watch(user, newUser => {
        if (newUser) {
            navigateTo(defaultUrl)
        }
    }, {immediate: true})
    
    return {user}
}