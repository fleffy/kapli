import { Dialog } from '@headlessui/react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { HistoryEntry } from '../../types'
import { Button } from '../ui/Button'

interface HistoryDialogProps {
	isOpen: boolean
	onClose: () => void
	history: HistoryEntry[]
	onExport: () => void
}

export function HistoryDialog({
	isOpen,
	onClose,
	history,
	onExport,
}: HistoryDialogProps) {
	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />
			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
					<Dialog.Title className='text-lg font-medium text-gray-100 mb-4'>
						История
					</Dialog.Title>

					<div className='space-y-6'>
						{history.length === 0 ? (
							<p className='text-gray-400'>История пока пуста</p>
						) : (
							history.map((entry) => (
								<div key={entry.date} className='border-b border-gray-700 pb-4'>
									<h3 className='text-gray-100 font-medium mb-2'>
										{format(new Date(entry.date), 'd MMMM yyyy', {
											locale: ru,
										})}
									</h3>
									<div className='space-y-3'>
										{entry.drops.map((drop, idx) => (
											<div key={idx} className='pl-4'>
												<p className='text-gray-300'>
													{drop.name}
													{drop.completed && (
														<span className='ml-2 text-emerald-500 text-sm'>
															(Выполнено)
														</span>
													)}
												</p>
												<div className='flex flex-wrap gap-2 mt-1'>
													{drop.times.map((time, timeIdx) => (
														<span
															key={timeIdx}
															className='text-xs bg-gray-700 rounded px-2 py-1 text-gray-300'
														>
															{time}
														</span>
													))}
												</div>
											</div>
										))}
									</div>
								</div>
							))
						)}
					</div>

					<div className='mt-6 flex justify-between'>
						<Button variant='secondary' onClick={onClose}>
							Закрыть
						</Button>
						<Button onClick={onExport}>Экспортировать</Button>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	)
}
