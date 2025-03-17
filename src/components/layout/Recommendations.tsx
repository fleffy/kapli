import { EyeDrop } from '../../types'
import { Card } from '../ui/Card'

interface RecommendationsProps {
	drops: EyeDrop[]
	recommendedId: number | null
}

export function Recommendations({
	drops,
	recommendedId,
}: RecommendationsProps) {
	const recommendedDrop = drops.find((drop) => drop.id === recommendedId)

	if (!recommendedDrop) {
		return null
	}

	return (
		<Card className='bg-blue-900/20 border-blue-500/20'>
			<h3 className='text-lg font-medium text-blue-100 mb-2'>
				Рекомендуемые капли
			</h3>
			<div className='space-y-2'>
				<div className='flex items-center justify-between'>
					<span className='text-blue-200'>{recommendedDrop.name}</span>
					<span className='text-sm text-blue-300'>
						{recommendedDrop.usageTimesToday.length} из{' '}
						{recommendedDrop.timesPerDay}
					</span>
				</div>
				<div className='text-sm text-blue-300'>
					Осталось дней: {recommendedDrop.daysLeft}
				</div>
			</div>
		</Card>
	)
}
