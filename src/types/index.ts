export interface Settings {
	colorMode: 'dark' | 'darker'
	fontSize: 'normal' | 'large'
	soundEnabled: boolean
	timerDuration: number
	showRecommendations: boolean
	showProgress: boolean
	timeFormat: '12h' | '24h'
	autoExport: boolean
	sleepTime: string
	wakeTime: string
	showSideEffects: boolean
}

export interface EyeDrop {
	id: number
	name: string
	timesPerDay: number
	daysLeft: number
	lastUsed: Date | null
	totalDropsToday: number
	usageTimesToday: Date[]
	priority: number
	schedule: { [key: string]: number }
}

export interface HistoryEntry {
	date: string
	drops: {
		name: string
		times: string[]
		completed: boolean
	}[]
}

export interface SideEffect {
	id: number
	date: string
	description: string
	severity: 'low' | 'medium' | 'high'
}
