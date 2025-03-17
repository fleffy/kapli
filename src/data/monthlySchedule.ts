import { EyeDrop } from '../types'
import { format, addDays } from 'date-fns'

const startDate = new Date()
const generateSchedule = (days: number, dropsPerDay: number) => {
	const schedule: { [key: string]: number } = {}
	for (let i = 0; i < days; i++) {
		const date = format(addDays(startDate, i), 'yyyy-MM-dd')
		schedule[date] = dropsPerDay
	}
	return schedule
}

export const defaultDrops: EyeDrop[] = [
	{
		id: 1,
		name: 'Тобрекс',
		timesPerDay: 2,
		daysLeft: 30,
		lastUsed: null,
		totalDropsToday: 0,
		usageTimesToday: [],
		priority: 1,
		schedule: generateSchedule(30, 2),
	},
	{
		id: 2,
		name: 'Дексаметазон',
		timesPerDay: 3,
		daysLeft: 30,
		lastUsed: null,
		totalDropsToday: 0,
		usageTimesToday: [],
		priority: 2,
		schedule: generateSchedule(30, 3),
	},
	{
		id: 3,
		name: 'Тауфон',
		timesPerDay: 2,
		daysLeft: 30,
		lastUsed: null,
		totalDropsToday: 0,
		usageTimesToday: [],
		priority: 3,
		schedule: generateSchedule(30, 2),
	},
]

// Важные заметки для пользователя
export const importantNotes = [
	'Перерва між закрапуваннями 5-10 хвилин',
	'Очі не вмиваємо звичайною водою протягом 2х тижнів',
	'Протирати повіки серветками «Блефаклін» 2 рази на день',
]
