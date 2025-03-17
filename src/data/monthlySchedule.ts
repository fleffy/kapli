import { EyeDrop } from '../types'
import { format, addDays } from 'date-fns'

const startDate = new Date()

// Функция для генерации расписания с учетом разных периодов и снижения дозы
const generateComplexSchedule = (config: {
	name: string
	surgeryDayDrops?: number
	firstPeriodDays?: number
	firstPeriodDrops?: number
	decreasingSchedule?: Array<{ days: number; drops: number }>
	totalDays: number
}) => {
	const schedule: { [key: string]: number } = {}

	// День операции
	if (config.surgeryDayDrops) {
		schedule[format(startDate, 'yyyy-MM-dd')] = config.surgeryDayDrops
	}

	let currentDay = 1

	// Первый период (обычно 5 дней)
	if (config.firstPeriodDays && config.firstPeriodDrops) {
		for (let i = currentDay; i <= config.firstPeriodDays; i++) {
			const date = format(addDays(startDate, i), 'yyyy-MM-dd')
			schedule[date] = config.firstPeriodDrops
		}
		currentDay += config.firstPeriodDays
	}

	// Период снижения дозы (если есть)
	if (config.decreasingSchedule) {
		for (const period of config.decreasingSchedule) {
			for (let i = 0; i < period.days; i++) {
				const date = format(addDays(startDate, currentDay + i), 'yyyy-MM-dd')
				schedule[date] = period.drops
			}
			currentDay += period.days
		}
	}

	return schedule
}

export const defaultDrops: EyeDrop[] = [
	{
		id: 1,
		name: 'Цитомоксан',
		timesPerDay: 5,
		daysLeft: 6,
		lastUsed: null,
		totalDropsToday: 0,
		usageTimesToday: [],
		priority: 1,
		schedule: generateComplexSchedule({
			name: 'Цитомоксан',
			surgeryDayDrops: 5, // 1 капля каждые 2 часа (не более 5 раз)
			firstPeriodDays: 5,
			firstPeriodDrops: 3, // 3 раза в день
			totalDays: 6,
		}),
	},
	{
		id: 2,
		name: 'Дексапос',
		timesPerDay: 4,
		daysLeft: 20,
		lastUsed: null,
		totalDropsToday: 0,
		usageTimesToday: [],
		priority: 2,
		schedule: generateComplexSchedule({
			name: 'Дексапос',
			surgeryDayDrops: 6, // каждые 2 часа до сна
			firstPeriodDays: 5,
			firstPeriodDrops: 4,
			decreasingSchedule: [
				{ days: 5, drops: 3 }, // 3 раза в день 5 дней
				{ days: 5, drops: 2 }, // 2 раза в день 5 дней
				{ days: 5, drops: 1 }, // 1 раз в день 5 дней
			],
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
			name: 'Супероптик аква',
			firstPeriodDays: 30,
			firstPeriodDrops: 4, // 4 раза в день месяц
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
