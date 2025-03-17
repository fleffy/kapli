import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { saveAs } from 'file-saver'
import { useAuth } from './hooks/useAuth'
import { useFirebaseSync } from './hooks/useFirebaseSync'
import { EyeDrop, HistoryEntry, Settings, SideEffect } from './types'
import { Timer } from './components/layout/Timer'
import { Progress } from './components/layout/Progress'
import { ImportantNotes } from './components/layout/ImportantNotes'
import { Navigation } from './components/layout/Navigation'
import { DropsList } from './components/drops/DropsList'
import { SettingsDialog } from './components/dialogs/SettingsDialog'
import { HistoryDialog } from './components/dialogs/HistoryDialog'
import { SideEffectsDialog } from './components/dialogs/SideEffectsDialog'
import { defaultDrops } from './data/monthlySchedule'
import { SettingsProvider } from './contexts/SettingsContext'

// Добавляем функции для работы с localStorage
const loadFromLocalStorage = (key: string, defaultValue: unknown): unknown => {
	const stored = localStorage.getItem(key)
	if (stored) {
		try {
			return JSON.parse(stored)
		} catch (e) {
			console.error(`Error loading ${key} from localStorage:`, e)
			return defaultValue
		}
	}
	return defaultValue
}

const saveToLocalStorage = (key: string, value: unknown): void => {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch (e) {
		console.error(`Error saving ${key} to localStorage:`, e)
	}
}

function App() {
	const { user, signIn, error: authError, loading: authLoading } = useAuth()

	const handleSignIn = async () => {
		console.log('Sign in button clicked')
		try {
			await signIn()
			console.log('Sign in successful')
		} catch (error) {
			console.error('Sign in failed:', error)
		}
	}

	// Загружаем сохраненные данные при инициализации
	const [drops, setDrops] = useState<EyeDrop[]>(() => {
		const savedDrops = loadFromLocalStorage('drops', defaultDrops) as EyeDrop[]

		// Преобразуем строковые даты обратно в объекты Date
		return savedDrops.map((drop: EyeDrop) => ({
			...drop,
			lastUsed: drop.lastUsed
				? new Date(drop.lastUsed as unknown as string)
				: null,
			usageTimesToday: (drop.usageTimesToday as unknown as string[]).map(
				(time: string) => new Date(time)
			),
		}))
	})

	const [history, setHistory] = useState<HistoryEntry[]>(
		() => loadFromLocalStorage('history', []) as HistoryEntry[]
	)

	const [timeLeft, setTimeLeft] = useState<number>(() => {
		const savedTimeLeft = loadFromLocalStorage('timeLeft', 0) as number
		const savedTime = loadFromLocalStorage('timeLeftStart', 0) as number

		if (savedTimeLeft > 0 && savedTime > 0) {
			const elapsed = Date.now() - savedTime
			return Math.max(0, savedTimeLeft - Math.floor(elapsed / 1000))
		}
		return 0
	})

	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const [isHistoryOpen, setIsHistoryOpen] = useState(false)
	const [settings, setSettings] = useState<Settings>(
		() =>
			loadFromLocalStorage('settings', {
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
			}) as Settings
	)

	const [sideEffects, setSideEffects] = useState<SideEffect[]>(
		() => loadFromLocalStorage('sideEffects', []) as SideEffect[]
	)

	const [isSideEffectsOpen, setIsSideEffectsOpen] = useState(false)

	// Инициализация Firebase синхронизации
	const {
		data: firebaseData,
		isSyncing,
		updateData,
	} = useFirebaseSync(user?.uid || '', {
		drops,
		history,
		settings,
		sideEffects,
		timeLeft,
		timeLeftStart: Date.now(),
	})

	// Обновляем локальное состояние при изменении данных в Firebase
	useEffect(() => {
		if (firebaseData && user?.uid) {
			console.log('Received Firebase data:', firebaseData)
			if (firebaseData.drops) {
				setDrops(
					firebaseData.drops.map((drop: EyeDrop) => ({
						...drop,
						lastUsed: drop.lastUsed ? new Date(drop.lastUsed) : null,
						usageTimesToday: Array.isArray(drop.usageTimesToday)
							? (drop.usageTimesToday as unknown as string[]).map(
									(time: string) => new Date(time)
								)
							: [],
					}))
				)
			}
			if (firebaseData.history) {
				setHistory(
					firebaseData.history.map((entry: HistoryEntry) => ({
						...entry,
						drops: entry.drops.map((drop) => ({
							...drop,
							times: Array.isArray(drop.times) ? drop.times : [],
						})),
					}))
				)
			}
			if (firebaseData.settings) {
				setSettings((prev) => ({
					...prev,
					...firebaseData.settings,
				}))
			}
			if (firebaseData.sideEffects) {
				setSideEffects(
					firebaseData.sideEffects.map((effect: SideEffect) => ({
						...effect,
						date: effect.date, // Оставляем как строку, так как это тип в интерфейсе
					}))
				)
			}
			if (firebaseData.timeLeft !== undefined) {
				setTimeLeft(firebaseData.timeLeft)
			}
		}
	}, [firebaseData, user?.uid])

	useEffect(() => {
		if (user?.uid && !isSyncing) {
			console.log('Updating Firebase with local data')
			updateData({
				drops,
				history,
				settings,
				sideEffects,
				timeLeft,
				timeLeftStart: Date.now(),
			})
		}
	}, [
		drops,
		history,
		settings,
		sideEffects,
		timeLeft,
		user?.uid,
		isSyncing,
		updateData,
	])

	// Обновляем таймер каждую секунду
	useEffect(() => {
		if (timeLeft <= 0) return

		const timer = setInterval(() => {
			setTimeLeft((prev) => Math.max(0, prev - 1))
		}, 1000)

		return () => clearInterval(timer)
	}, [timeLeft])

	// Сохраняем данные при их изменении
	useEffect(() => {
		saveToLocalStorage('drops', drops)
	}, [drops])

	useEffect(() => {
		saveToLocalStorage('history', history)
	}, [history])

	useEffect(() => {
		saveToLocalStorage('timeLeft', timeLeft)
		if (timeLeft > 0) {
			saveToLocalStorage('timeLeftStart', Date.now())
		}
	}, [timeLeft])

	useEffect(() => {
		saveToLocalStorage('settings', settings)
	}, [settings])

	useEffect(() => {
		saveToLocalStorage('sideEffects', sideEffects)
	}, [sideEffects])

	const canUseAnyDrop = () => {
		return timeLeft === 0
	}

	const getRecommendedNextDrop = () => {
		if (!canUseAnyDrop()) return null

		const incompletedDrops = drops.filter(
			(drop) => drop.totalDropsToday < drop.timesPerDay
		)
		if (incompletedDrops.length === 0) return null

		const getProgress = (drop: EyeDrop) =>
			drop.totalDropsToday / drop.timesPerDay
		const minProgress = Math.min(...incompletedDrops.map(getProgress))

		const lowestProgressDrops = incompletedDrops.filter(
			(drop) => getProgress(drop) === minProgress
		)

		if (lowestProgressDrops.length > 1) {
			return lowestProgressDrops.sort((a, b) => b.priority - a.priority)[0].id
		}

		return lowestProgressDrops[0].id
	}

	const markDropUsed = (id: number) => {
		const now = new Date()
		setDrops(
			drops.map((drop) => {
				if (drop.id === id) {
					const updatedDrop = {
						...drop,
						lastUsed: now,
						totalDropsToday: drop.totalDropsToday + 1,
						usageTimesToday: [...drop.usageTimesToday, now],
					}

					// Обновляем историю при каждом использовании капель
					const today = format(now, 'yyyy-MM-dd')
					const todayEntry = history.find((entry) => entry.date === today)

					if (todayEntry) {
						const dropEntry = todayEntry.drops.find((d) => d.name === drop.name)
						if (dropEntry) {
							dropEntry.times.push(format(now, 'HH:mm', { locale: ru }))
							dropEntry.completed =
								updatedDrop.totalDropsToday >= updatedDrop.timesPerDay
						} else {
							todayEntry.drops.push({
								name: drop.name,
								times: [format(now, 'HH:mm', { locale: ru })],
								completed:
									updatedDrop.totalDropsToday >= updatedDrop.timesPerDay,
							})
						}
						setHistory([...history])
					} else {
						setHistory([
							...history,
							{
								date: today,
								drops: [
									{
										name: drop.name,
										times: [format(now, 'HH:mm', { locale: ru })],
										completed:
											updatedDrop.totalDropsToday >= updatedDrop.timesPerDay,
									},
								],
							},
						])
					}

					return updatedDrop
				}
				return drop
			})
		)
		setTimeLeft(600) // 10 минут в секундах
	}

	const exportHistory = () => {
		const historyData = JSON.stringify(history, null, 2)
		const blob = new Blob([historyData], { type: 'application/json' })
		saveAs(blob, `eye-drops-history-${format(new Date(), 'yyyy-MM-dd')}.json`)
	}

	const getFontSize = () => {
		return settings.fontSize === 'normal' ? 'text-base' : 'text-lg'
	}

	const getThemeClasses = () => {
		switch (settings.colorMode) {
			case 'darker':
				return 'bg-gray-950'
			case 'dark':
			default:
				return 'bg-gray-900'
		}
	}

	const recommendedId = getRecommendedNextDrop()

	return (
		<div
			className={`min-h-screen text-gray-100 ${getFontSize()} ${getThemeClasses()} transition-colors duration-300 ease-in-out`}
		>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl'>
				{!user ? (
					<div className='flex flex-col items-center justify-center min-h-[60vh]'>
						<h1 className='text-3xl font-bold mb-8 animate-fade-in'>Kapli</h1>
						<button
							onClick={handleSignIn}
							disabled={authLoading}
							className='px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95'
						>
							{authLoading ? 'Загрузка...' : 'Войти'}
						</button>
						{authError && (
							<p className='mt-4 text-red-500 animate-fade-in'>{authError}</p>
						)}
					</div>
				) : (
					<>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto'>
							<div className='lg:col-span-2 space-y-4 sm:space-y-6'>
								<div className='flex justify-between items-center'>
									<h1 className='text-3xl font-bold text-gray-100'>Kapli</h1>
									<div className='transform transition-all duration-300 ease-in-out hover:scale-[1.01]'>
										<Timer timeLeft={timeLeft} onTimeUp={() => {}} />
									</div>
								</div>

								{settings.showProgress && <Progress drops={drops} />}

								<div className='transform transition-all duration-300 ease-in-out hover:scale-[1.01]'>
									<DropsList
										drops={drops}
										timeLeft={timeLeft}
										canUseAnyDrop={canUseAnyDrop()}
										onMarkUsed={markDropUsed}
										recommendedId={recommendedId}
									/>
								</div>

								<div className='transform transition-all duration-300 ease-in-out hover:scale-[1.01]'>
									<Navigation
										onSettingsClick={() => setIsSettingsOpen(true)}
										onHistoryClick={() => setIsHistoryOpen(true)}
										onSideEffectsClick={() => setIsSideEffectsOpen(true)}
									/>
								</div>

								<div className='transform transition-all duration-300 ease-in-out hover:scale-[1.01]'>
									<ImportantNotes />
								</div>
							</div>
						</div>

						<SettingsDialog
							isOpen={isSettingsOpen}
							onClose={() => setIsSettingsOpen(false)}
							settings={settings}
							onSettingsChange={setSettings}
							onReset={() => {
								setSettings({
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
								})
								setIsSettingsOpen(false)
							}}
						/>

						<HistoryDialog
							isOpen={isHistoryOpen}
							onClose={() => setIsHistoryOpen(false)}
							history={history}
							onExport={exportHistory}
						/>

						<SideEffectsDialog
							isOpen={isSideEffectsOpen}
							onClose={() => setIsSideEffectsOpen(false)}
							onAddSideEffect={(effect) => {
								const newEffect: SideEffect = {
									...effect,
									id: Date.now(),
								}
								setSideEffects([...sideEffects, newEffect])
								setIsSideEffectsOpen(false)
							}}
						/>
					</>
				)}
			</div>
		</div>
	)
}

const AppWithProvider = () => (
	<SettingsProvider>
		<App />
	</SettingsProvider>
)

export default AppWithProvider
