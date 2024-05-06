import { endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, sub } from "date-fns"

interface Period {
    from: Date;
    to: Date;
}

export const useSelectedPeriod = (period: Ref<string>) => {
    const now = new Date();

    const current = computed<Period>(() => {
        switch (period.value) {
            case 'Daily':
                return {
                    from: startOfDay(now),
                    to: endOfDay(now)
                };
            case 'Monthly':
                return {
                    from: startOfMonth(now),
                    to: endOfMonth(now)
                };
            case 'Annually':
                return {
                    from: startOfYear(now),
                    to: endOfYear(now)
                };
            case 'All Time': {
                return {
                    from: new Date(('2020-01-01')),
                    to: endOfYear(now)
                }
            };
            default:
                return {
                    from: startOfDay(now),
                    to: endOfDay(now)
                };
        }
    });


    const previous = computed<Period>(() => {
        switch (period.value) {
            case 'Daily':
                return {
                    from: startOfDay(sub(now, { days: 1 })),
                    to: endOfDay(sub(now, { days: 1 }))
                };
            case 'Monthly':
                return {
                    from: startOfMonth(sub(now, { months: 1 })),
                    to: endOfMonth(sub(now, { months: 1 }))
                };
            case 'Annually':
                return {
                    from: startOfYear(sub(now, { years: 1 })),
                    to: endOfYear(sub(now, { years: 1 }))
                };
            case 'All Time': 
                return {
                    from: startOfYear(sub(new Date('2020-01-01'), {years: 3 })),
                    to: endOfYear(sub(new Date('2020-01-01'), {years: 3 }))
                }    
            default:
                return {
                    from: startOfDay(sub(now, { days: 1 })),
                    to: endOfDay(sub(now, { days: 1 }))
                };
        }
    });

    return {
        current,
        previous
    }
}