import { useState, useEffect } from 'react'
import {
	signInWithPopup,
	onAuthStateChanged,
	signOut,
	User,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(user) => {
				console.log('Auth state changed:', user?.uid)
				setUser(user)
				setLoading(false)
			},
			(error) => {
				console.error('Auth state change error:', error)
				setError(error.message)
			}
		)

		return () => unsubscribe()
	}, [])

	const signIn = async () => {
		try {
			setError(null)
			console.log('Attempting Google sign in...')
			const result = await signInWithPopup(auth, googleProvider)
			console.log('Google sign in successful:', result.user.uid)
			setUser(result.user)
		} catch (error) {
			console.error('Google sign in error:', error)
			setError((error as Error).message)
		}
	}

	const logout = async () => {
		try {
			setError(null)
			await signOut(auth)
			setUser(null)
		} catch (error) {
			console.error('Sign out error:', error)
			setError((error as Error).message)
		}
	}

	return {
		user,
		loading,
		error,
		signIn,
		logout,
	}
}
