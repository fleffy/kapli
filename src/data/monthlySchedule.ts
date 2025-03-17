import { EyeDrop } from '../types'
import { format, addDays } from 'date-fns'

const startDate = new Date()

// Generate schedule with varying drops per day
const generateComplexSchedule = (config: {
	surgeryDayDrops?: number
	firstFiveDaysDrops?: number
	remainingDaysDrops?: number
	totalDays: number
}) => {
	const schedule: { [key: string]: number } = {}

	// Surgery day
	if (config.surgeryDayDrops) {
		schedule[format(startDate, 'yyyy-MM-dd')] = config.surgeryDayDrops
	}

	// First 5 days after surgery
	for (let i = 1; i <= 5; i++) {
		if (config.firstFiveDaysDrops) {
			const date = format(addDays(startDate, i), 'yyyy-MM-dd')
			schedule[date] = config.firstFiveDaysDrops
		}
	}

	// Remaining days
	for (let i = 6; i < config.totalDays; i++) {
		if (config.remainingDaysDrops) {
			const date = format(addDays(startDate, i), 'yyyy-MM-dd')
			schedule[date] = config.remainingDaysDrops
		}
	}

	return schedule
}

export const defaultDrops: EyeDrop[] = [
	{
		id: 1,
		name: 'Цитомоксан',
		timesPerDay: 5,
		daysLeft: 6, // 1 день операции + 5 дней после
		lastUsed: null,
		totalDropsToday: 0,
		usageTimesToday: [],
		priority: 1,
		schedule: generateComplexSchedule({
			surgeryDayDrops: 5, // каждые 2 часа до сна (макс 5 раз)
			firstFiveDaysDrops: 3, // 3 раза в день
			totalDays: 6,
		}),
	},
	{
		id: 2,
		name: 'Дексапос',
		timesPerDay: 4,
		daysLeft: 20, // общая длительность курса
		lastUsed: null,
		totalDropsToday: 0,
		usageTimesToday: [],
		priority: 2,
		schedule: generateComplexSchedule({
			surgeryDayDrops: 6, // каждые 2 часа до сна
			firstFiveDaysDrops: 4,
			remainingDaysDrops: 1, // постепенное снижение
			totalDays: 20,
		}),
	},
	{
		id: 3,
		name: 'Супероптик аква',
		timesPerDay: 4,
		daysLeft: 30,
		lastUsed: null,
		totalDropsToday: 0,
		usageTimesToday: [],
		priority: 3,
		schedule: generateComplexSchedule({
			firstFiveDaysDrops: 4,
			remainingDaysDrops: 4,
			totalDays: 30,
		}),
	},
]

// Важные заметки для пользователя
export const importantNotes = [
	'Перерва між закрапуваннями 5-10 хвилин',
	'Очі не вмиваємо звичайною водою протягом 2х тижнів',
	'Протирати повіки серветками «Блефаклін» 2 рази на день',
]
