import { useState, useEffect, useCallback, useRef } from 'react'
import { ref, onValue, set, off } from 'firebase/database'
import { database } from '../firebase'
import { EyeDrop, HistoryEntry, Settings, SideEffect } from '../types'

interface FirebaseData {
	drops: EyeDrop[]
	history: HistoryEntry[]
	settings: Settings
	sideEffects: SideEffect[]
	timeLeft: number
	timeLeftStart: number
}

interface UseFirebaseSyncResult {
	data: FirebaseData | null
	isSyncing: boolean
	error: string | null
	updateData: (data: FirebaseData) => Promise<void>
}

export function useFirebaseSync(
	userId: string,
	initialData: FirebaseData
): UseFirebaseSyncResult {
	const [data, setData] = useState<FirebaseData | null>(initialData)
	const [isSyncing, setIsSyncing] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const lastUpdateRef = useRef<number>(0)
	const dataRef = useRef<FirebaseData | null>(null)

	// Функция для сравнения объектов
	const isDataEqual = (a: FirebaseData, b: FirebaseData): boolean => {
		return JSON.stringify(a) === JSON.stringify(b)
	}

	// Функция для обновления данных в Firebase
	const updateData = useCallback(
		async (newData: FirebaseData) => {
			if (!userId) return

			try {
				setIsSyncing(true)
				setError(null)

				// Проверяем, прошло ли достаточно времени с последнего обновления
				const now = Date.now()
				if (now - lastUpdateRef.current < 1000) {
					// Если прошло меньше секунды, игнорируем обновление
					return
				}
				lastUpdateRef.current = now

				// Проверяем, действительно ли данные изменились
				if (dataRef.current && isDataEqual(dataRef.current, newData)) {
					return
				}

				const userRef = ref(database, `users/${userId}`)
				await set(userRef, newData)
				dataRef.current = newData
			} catch (err) {
				console.error('Error updating Firebase:', err)
				setError(
					err instanceof Error ? err.message : 'Ошибка обновления данных'
				)
			} finally {
				setIsSyncing(false)
			}
		},
		[userId]
	)

	// Подписка на изменения данных
	useEffect(() => {
		if (!userId) return

		const userRef = ref(database, `users/${userId}`)
		let isFirstUpdate = true

		onValue(
			userRef,
			(snapshot) => {
				const newData = snapshot.val()

				// Игнорируем первое обновление, если данные не изменились
				if (
					isFirstUpdate &&
					dataRef.current &&
					isDataEqual(dataRef.current, newData)
				) {
					isFirstUpdate = false
					return
				}
				isFirstUpdate = false

				// Проверяем, действительно ли данные изменились
				if (dataRef.current && isDataEqual(dataRef.current, newData)) {
					return
				}

				console.log('Received data from Firebase:', newData)
				setData(newData)
				dataRef.current = newData
			},
			(error) => {
				console.error('Firebase sync error:', error)
				setError(error.message)
			}
		)

		return () => {
			off(userRef)
		}
	}, [userId])

	return {
		data,
		isSyncing,
		error,
		updateData,
	}
}
