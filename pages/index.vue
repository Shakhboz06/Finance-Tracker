<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-3xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu v-model="select" :options="options" class="w-full lg: w-28" />
    </div>
  </section>

  <section class="grid grid-cols-1 sm: grid-cols-2 lg: grid-cols-4 sm: gap-16 mb-10">
    <Trend color="green" title="Income" :amount="totalIncome" :last-amount="prevIncTotal" :loading="pending" />
    <Trend color="red" title="Expense" :amount="totalExpense" :last-amount="prevExpTotal" :loading="pending" />
    <Trend color="green" title="Investment" :amount="7000" :last-amount="5370" :loading="pending" />
    <Trend color="red" title="Saving Jar" :amount="5200" :last-amount="5000" :loading="pending" />
  </section>
  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400 mt-5">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses in this period
      </div>
    </div>
    <div>
      <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
      <TransactionModal v-model="isOpen" @saved="refresh" />
    </div>
  </section>
  <section v-if="!pending">
    <div v-for="(transaction, date) in groupedByDate" :key="date" class="mb-10">
      <DailyTransactions :transaction="transaction" :date="date" />
      <Transactions v-for="item in transaction" :key="item.id" :transaction="item" @deleted="refresh()"
        @edited="refresh()" />
    </div>
  </section>
  <section v-else>
    <USkeleton v-for="i in 4" :key="i" class="h-8 w-full mb-2" />
  </section>
</template>

<script lang="ts" setup>
import { options } from '~/constants'


const user = useSupabaseUser()
const isOpen = ref<boolean>(false)
const select = ref(user.value?.user_metadata.transaction_view ?? options[0])
const { current, previous } = useSelectedPeriod(select)

const { pending, refresh, transactions: {
  totalExpense,
  totalIncome,
  expenseCount,
  incomeCount,
  totalInvestment,
  totalSaving,
  grouped: {
    groupedByDate
  }
} } = useFetchTransactions(current)

const { refresh: refreshPrevious, transactions: {
  totalExpense: prevExpTotal,
  totalIncome: prevIncTotal,
  totalInvestment: prevInvTotal,
  totalSaving: prevSavTotal,
} } = useFetchTransactions(previous)


await refreshPrevious()
watch(user, (user) => {
  if(!user){
    navigateTo('/login')
  }
}, {immediate: true})


</script>

<style scoped></style>