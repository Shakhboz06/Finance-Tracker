import { createClient } from "@supabase/supabase-js"
import { faker } from '@faker-js/faker'
import 'dotenv/config'

const categories = ['Bills', 'Cash', 'Eating out', 'Entertainment', 'Family', 'Groceries', 'Housing', 'Investments',
    'Personal Care', 'Savings', 'Shopping', 'Transport', 'Trips']

const supabase = createClient(
    process.env.SUPABASE_URL,
    // Supabase service key, 
    {
    auth: { persistSession: false }
});

const { data: { users }, error } = await supabase.auth.admin.listUsers()
const userIds = users.map(user => user.id)

async function seedTransactions() {
    let transactions = [];

    const { error: deleteError } = await supabase.from('Transactions').delete().gte('id', 0)

    if (deleteError) {
        console.error('Error deleting existing data:', deleteError)
        return
    }

    for(let user of userIds){
        for (let year = new Date().getFullYear(); year > new Date().getFullYear() - 2; year--) {
            for (let i = 0; i < 10; i++) {
                const date = new Date(year, faker.number.int({ min: 0, max: 11 }), faker.number.int({ min: 1, max: 28 })).toISOString()
    
                let type, category
                const typeBias = Math.random();
    
                if (typeBias < 0.85) {
                    type = 'Expense';
                    category = faker.helpers.arrayElement(categories);
                } else if (typeBias < 0.95) {
                    type = 'Income';
                } else {
                    type = faker.helpers.arrayElement(['Saving', 'Investment']);
                }
    
                let amount;
                switch (type) {
                    case 'Income':
                        amount = faker.number.float({ min: 2000, max: 5000, multipleOf: 0.01 });
                        break;
                    case 'Expense':
                        amount = faker.number.float({ min: 100, max: 1000, multipleOf: 0.01 });
                        break;
                    case 'Saving':
                    case 'Investment':
                        amount = faker.number.float({ min: 5000, max: 10000, multipleOf: 0.01 });
                        break;
                    default:
                        amount = 0;
                }
    
                transactions.push({
                    created_at: date,
                    amount,
                    type,
                    description: faker.lorem.sentence(),
                    category: type === 'Expense' ? category : null,
                    user_id: user
                });
            }
        }
    }

    
    const { error: insertError } = await supabase.from('Transactions').upsert(transactions);
    if (insertError) {
        console.error('Error inserting data:', insertError);
    } else {
        console.log('Data inserted successfully.');
    }
}

seedTransactions().catch(console.error);
