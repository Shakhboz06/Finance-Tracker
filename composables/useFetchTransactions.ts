import { type transaction } from '~/types/transaction'
import { type Period } from '~/types/period'

export const useFetchTransactions = (period: ComputedRef<Period>) => {

    const supabase = useSupabaseClient()
    const transactions = ref<transaction[]>([])
    const pending = ref(false)

    const totalIncome = computed(() => {
        let total = 0
        for (const item of transactions.value) {
            if (item.type === 'Income') total += item.amount
        }
        return total
    })
    
    
    const totalExpense = computed(() => {
        let total = 0
        for (const item of transactions.value) {
            if (item.type === 'Expense') total += item.amount
        }
        return total
    })

    const totalInvestment = computed(() => {
        let total = 0
        for (const item of transactions.value) {
            if (item.type === 'Investment') total += item.amount
        }
        return total
    })
    
    const totalSaving = computed(() => {
        let total = 0
        for (const item of transactions.value) {
            if (item.type === 'Saving') total += item.amount
        }
        return total
    })
    
    
    const incomeCount = computed(() => transactions.value.filter(el => el.type === 'Income').length)
    const expenseCount = computed(() => transactions.value.filter(el => el.type === 'Expense').length)
    const investmentCount = computed(() => transactions.value.filter(el => el.type === 'Investment').length)
    const savingCount = computed(() => transactions.value.filter(el => el.type === 'Saving').length)
    
    
    const fetchData = async () => {
        pending.value = true
        try {
            const { data } = await useAsyncData(`transaction-${period.value.from.toDateString()} - ${period.value.to.toDateString()}`, async () => {
                const response  = await supabase.from('Transactions').select()
                .gte('created_at', period.value.from.toISOString())
                .lte('created_at', period.value.to.toISOString())
                .order('created_at', { ascending: false })
                
                return response.data
            })
            return data.value
        } finally {
            pending.value = false
        }
    }
    
    const refresh = async () => transactions.value = await fetchData() as transaction[]
    watch(period, async () => await refresh(), {immediate: true})
    

    const groupedByDate = computed(() => {
        const grouped: Record<string, transaction[]> = {}
        
        for (let item of transactions.value) {
            const date = item.created_at.split('T')[0]

            if (!grouped[date]) grouped[date] = []
            grouped[date].push(item)
        }
        return grouped
    })


    return{
        transactions: {
            all: transactions,
            grouped: {
                groupedByDate
            },
            totalIncome,
            totalExpense,
            expenseCount,
            incomeCount,
            totalInvestment,
            totalSaving
        },
        refresh,
        pending,
    }
}