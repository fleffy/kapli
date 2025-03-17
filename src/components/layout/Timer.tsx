import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface TimerProps {
	timeLeft: number
	onTimeUp: () => void
}

export function Timer({ timeLeft, onTimeUp }: TimerProps) {
	const [currentTime, setCurrentTime] = useState(new Date())

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date())
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		if (timeLeft === 0) {
			onTimeUp()
		}
	}, [timeLeft, onTimeUp])

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	return (
		<div className='text-right'>
			<div className='text-2xl font-bold text-emerald-500'>
				{formatTime(timeLeft)}
			</div>
			<div className='text-sm text-gray-400'>
				{format(currentTime, 'd MMMM', { locale: ru })}
			</div>
		</div>
	)
}
