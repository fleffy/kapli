import { createContext, useCallback, useState, ReactNode } from 'react'
import { Settings } from '../types'

interface SettingsContextType {
	settings: Settings
	updateSettings: (newSettings: Partial<Settings>) => void
}

export const SettingsContext = createContext<SettingsContextType | null>(null)

const defaultSettings: Settings = {
	colorMode: 'dark',
	fontSize: 'normal',
	soundEnabled: false,
	timerDuration: 600,
	showRecommendations: true,
	showProgress: true,
	timeFormat: '24h',
	autoExport: false,
	sleepTime: '23:00',
	wakeTime: '07:00',
	showSideEffects: true,
}

interface SettingsProviderProps {
	children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
	const [settings, setSettings] = useState<Settings>(() => {
		const stored = localStorage.getItem('settings')
		console.log('Loading settings from localStorage:', stored)
		if (stored) {
			try {
				const parsed = JSON.parse(stored)
				console.log('Parsed settings:', parsed)
				return { ...defaultSettings, ...parsed }
			} catch (e) {
				console.error('Error loading settings:', e)
			}
		}
		return defaultSettings
	})

	const updateSettings = useCallback((newSettings: Partial<Settings>) => {
		console.log('Updating settings:', newSettings)
		setSettings((prev) => {
			const updated = { ...prev, ...newSettings }
			console.log('New settings:', updated)
			localStorage.setItem('settings', JSON.stringify(updated))
			return updated
		})
	}, [])

	return (
		<SettingsContext.Provider value={{ settings, updateSettings }}>
			{children}
		</SettingsContext.Provider>
	)
}
