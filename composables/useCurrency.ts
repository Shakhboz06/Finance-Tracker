export const useCurrency = (amount: Ref<number> | number) => {
    const currency = computed(() => {
        const value = isRef(amount) ? amount.value : amount
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'EUR'
        }).format(value)
    })

    return {
        currency
    }
}