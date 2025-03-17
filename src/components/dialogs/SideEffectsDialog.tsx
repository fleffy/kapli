import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { SideEffect } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface SideEffectsDialogProps {
	isOpen: boolean
	onClose: () => void
	onAddSideEffect: (effect: Omit<SideEffect, 'id'>) => void
}

export function SideEffectsDialog({
	isOpen,
	onClose,
	onAddSideEffect,
}: SideEffectsDialogProps) {
	const [newSideEffect, setNewSideEffect] = useState<Partial<SideEffect>>({
		name: '',
		severity: 'low',
		notes: '',
	})

	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />
			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='bg-gray-800 rounded-lg p-6 max-w-sm w-full'>
					<Dialog.Title className='text-lg font-medium text-gray-100 mb-4'>
						Добавить побочный эффект
					</Dialog.Title>

					<div className='space-y-4'>
						<Input
							label='Название:'
							value={newSideEffect.name}
							onChange={(e) =>
								setNewSideEffect((prev) => ({
									...prev,
									name: e.target.value,
								}))
							}
							placeholder='Опишите эффект'
						/>

						<Select
							label='Степень выраженности:'
							value={newSideEffect.severity}
							onChange={(e) =>
								setNewSideEffect((prev) => ({
									...prev,
									severity: e.target.value as 'low' | 'medium' | 'high',
								}))
							}
							options={[
								{ value: 'low', label: 'Низкая' },
								{ value: 'medium', label: 'Средняя' },
								{ value: 'high', label: 'Высокая' },
							]}
						/>

						<div>
							<label className='block text-gray-300 mb-2'>Заметки:</label>
							<textarea
								value={newSideEffect.notes}
								onChange={(e) =>
									setNewSideEffect((prev) => ({
										...prev,
										notes: e.target.value,
									}))
								}
								className='w-full bg-gray-700 text-gray-100 rounded px-3 py-2'
								rows={3}
								placeholder='Дополнительные заметки'
							/>
						</div>
					</div>

					<div className='mt-6 flex justify-between'>
						<Button variant='secondary' onClick={onClose}>
							Отмена
						</Button>
						<Button
							onClick={() => {
								if (newSideEffect.name) {
									onAddSideEffect({
										name: newSideEffect.name,
										severity: newSideEffect.severity || 'low',
										date: new Date().toISOString(),
										notes: newSideEffect.notes || '',
									})
									setNewSideEffect({
										name: '',
										severity: 'low',
										notes: '',
									})
									onClose()
								}
							}}
						>
							Сохранить
						</Button>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	)
}
