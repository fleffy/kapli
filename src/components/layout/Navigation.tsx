interface NavigationProps {
	onSettingsClick: () => void
	onHistoryClick: () => void
	onSideEffectsClick: () => void
}

export function Navigation({
	onSettingsClick,
	onHistoryClick,
	onSideEffectsClick,
}: NavigationProps) {
	return (
		<div className='flex flex-wrap gap-2'>
			<button
				onClick={onSettingsClick}
				className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200'
			>
				Настройки
			</button>
			<button
				onClick={onHistoryClick}
				className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200'
			>
				История
			</button>
			<button
				onClick={onSideEffectsClick}
				className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200'
			>
				Побочные эффекты
			</button>
		</div>
	)
}
