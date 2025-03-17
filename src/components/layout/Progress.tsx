import { EyeDrop } from '../../types'

interface ProgressProps {
	drops: EyeDrop[]
}

export function Progress({ drops }: ProgressProps) {
	const totalDropsPerDay = drops.reduce(
		(sum, drop) => sum + drop.timesPerDay,
		0
	)
	const totalDropsToday = drops.reduce(
		(sum, drop) => sum + drop.totalDropsToday,
		0
	)
	const progress = (totalDropsToday / totalDropsPerDay) * 100

	return (
		<div>
			<div className='flex justify-between text-sm text-gray-400 mb-1'>
				<span>Прогресс</span>
				<span>
					{totalDropsToday} из {totalDropsPerDay}
				</span>
			</div>
			<div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
				<div
					className='h-full bg-emerald-500 transition-all duration-300 ease-out'
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	)
}
