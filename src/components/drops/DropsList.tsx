import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { EyeDrop } from '../../types'

interface DropsListProps {
	drops: EyeDrop[]
	timeLeft: number
	canUseAnyDrop: boolean
	onMarkUsed: (id: number) => void
	recommendedId?: number | null
}

export function DropsList({
	drops,
	timeLeft,
	canUseAnyDrop,
	onMarkUsed,
	recommendedId,
}: DropsListProps) {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
			{drops.map((drop) => (
				<div
					key={drop.id}
					className={`bg-gray-800 rounded-lg p-4 ${
						recommendedId === drop.id ? 'ring-2 ring-emerald-500' : ''
					}`}
				>
					<div className='flex justify-between items-start mb-4'>
						<h3 className='text-lg font-medium text-gray-100'>{drop.name}</h3>
						<div className='text-sm text-gray-400'>
							{drop.daysLeft} дней осталось
						</div>
					</div>

					<div className='space-y-2 mb-4'>
						<div className='text-sm text-gray-400'>
							Использовано сегодня: {drop.totalDropsToday} из {drop.timesPerDay}
						</div>
						{drop.lastUsed && (
							<div className='text-sm text-gray-400'>
								Последнее использование:{' '}
								{format(drop.lastUsed, 'HH:mm', { locale: ru })}
							</div>
						)}
					</div>

					<button
						onClick={() => onMarkUsed(drop.id)}
						disabled={!canUseAnyDrop || timeLeft > 0}
						className='w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors duration-200'
					>
						{timeLeft > 0 ? 'Подождите' : 'Закапать'}
					</button>
				</div>
			))}
		</div>
	)
}
