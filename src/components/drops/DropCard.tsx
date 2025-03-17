import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { EyeDrop } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface DropCardProps {
	drop: EyeDrop
	timeLeft: number
	canUseAnyDrop: boolean
	onMarkUsed: (id: number) => void
	isRecommended: boolean
}

export function DropCard({
	drop,
	timeLeft,
	canUseAnyDrop,
	onMarkUsed,
	isRecommended,
}: DropCardProps) {
	return (
		<Card
			className={`flex flex-col space-y-3 ${
				isRecommended ? 'ring-2 ring-emerald-700' : ''
			}`}
		>
			<div className='flex justify-between items-start'>
				<div>
					<h3 className='text-lg font-medium text-gray-100 flex items-center'>
						{drop.name}
						{isRecommended && (
							<span className='ml-2 text-sm text-emerald-500'>
								(рекомендуется)
							</span>
						)}
					</h3>
					<div className='text-sm text-gray-400 mt-1'>
						{drop.lastUsed && (
							<span>
								Последнее использование:{' '}
								{format(drop.lastUsed, 'HH:mm', { locale: ru })}
							</span>
						)}
					</div>
					<div className='text-sm text-gray-400'>
						{drop.totalDropsToday} из {drop.timesPerDay} раз
					</div>
					<p className='text-gray-400'>Осталось дней: {drop.daysLeft}</p>
					{drop.usageTimesToday.length > 0 && (
						<div className='mt-2'>
							<p className='text-gray-400 text-sm'>Использовано сегодня:</p>
							<div className='flex flex-wrap gap-2 mt-1'>
								{drop.usageTimesToday.map((time, index) => (
									<span
										key={index}
										className='text-xs bg-gray-700 rounded px-2 py-1 text-gray-300'
									>
										{format(time, 'HH:mm', { locale: ru })}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				{drop.totalDropsToday < drop.timesPerDay && (
					<Button
						onClick={() => onMarkUsed(drop.id)}
						disabled={!canUseAnyDrop || timeLeft > 0}
						variant={canUseAnyDrop ? 'primary' : 'secondary'}
						className='min-w-[120px]'
					>
						{canUseAnyDrop ? (
							'Закапать'
						) : (
							<span className='font-mono'>
								{Math.floor(timeLeft / 60)}:
								{(timeLeft % 60).toString().padStart(2, '0')}
							</span>
						)}
					</Button>
				)}
			</div>
		</Card>
	)
}
