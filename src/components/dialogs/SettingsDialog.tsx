import { Dialog } from '@headlessui/react'
import { Settings } from '../../types'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'

interface SettingsDialogProps {
	isOpen: boolean
	onClose: () => void
	settings: Settings
	onSettingsChange: (settings: Settings) => void
	onReset: () => void
}

export function SettingsDialog({
	isOpen,
	onClose,
	settings,
	onSettingsChange,
	onReset,
}: SettingsDialogProps) {
	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />
			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
					<Dialog.Title className='text-lg font-medium text-gray-100 mb-4'>
						Настройки
					</Dialog.Title>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Левая колонка */}
						<div className='space-y-6'>
							<div>
								<h3 className='text-gray-100 font-medium mb-4'>Внешний вид</h3>
								<div className='space-y-4'>
									<Select
										label='Тема:'
										value={settings.colorMode}
										onChange={(e) =>
											onSettingsChange({
												...settings,
												colorMode: e.target.value as 'dark' | 'darker',
											})
										}
										options={[
											{ value: 'dark', label: 'Тёмная' },
											{ value: 'darker', label: 'Очень тёмная' },
										]}
									/>

									<Select
										label='Размер шрифта:'
										value={settings.fontSize}
										onChange={(e) =>
											onSettingsChange({
												...settings,
												fontSize: e.target.value as 'normal' | 'large',
											})
										}
										options={[
											{ value: 'normal', label: 'Обычный' },
											{ value: 'large', label: 'Крупный' },
										]}
									/>

									<Select
										label='Формат времени:'
										value={settings.timeFormat}
										onChange={(e) =>
											onSettingsChange({
												...settings,
												timeFormat: e.target.value as '12h' | '24h',
											})
										}
										options={[
											{ value: '24h', label: '24-часовой (14:30)' },
											{ value: '12h', label: '12-часовой (2:30 PM)' },
										]}
									/>
								</div>
							</div>

							<div>
								<h3 className='text-gray-100 font-medium mb-4'>
									Таймер и уведомления
								</h3>
								<div className='space-y-4'>
									<Select
										label='Длительность таймера:'
										value={settings.timerDuration}
										onChange={(e) =>
											onSettingsChange({
												...settings,
												timerDuration: Number(e.target.value),
											})
										}
										options={[
											{ value: '1200', label: '20 минут' },
											{ value: '900', label: '15 минут' },
											{ value: '600', label: '10 минут' },
											{ value: '540', label: '9 минут' },
											{ value: '480', label: '8 минут' },
											{ value: '420', label: '7 минут' },
											{ value: '360', label: '6 минут' },
											{ value: '300', label: '5 минут' },
										]}
									/>

									<div className='space-y-2'>
										<label className='flex items-center space-x-2'>
											<input
												type='checkbox'
												checked={settings.soundEnabled}
												onChange={(e) =>
													onSettingsChange({
														...settings,
														soundEnabled: e.target.checked,
													})
												}
												className='rounded border-gray-600 text-emerald-600 focus:ring-emerald-500 bg-gray-700'
											/>
											<span className='text-gray-300'>
												Звуковые уведомления
											</span>
										</label>
									</div>
								</div>
							</div>
						</div>

						{/* Правая колонка */}
						<div className='space-y-6'>
							<div>
								<h3 className='text-gray-100 font-medium mb-4'>Отображение</h3>
								<div className='space-y-2'>
									<label className='flex items-center space-x-2'>
										<input
											type='checkbox'
											checked={settings.showRecommendations}
											onChange={(e) =>
												onSettingsChange({
													...settings,
													showRecommendations: e.target.checked,
												})
											}
											className='rounded border-gray-600 text-emerald-600 focus:ring-emerald-500 bg-gray-700'
										/>
										<span className='text-gray-300'>
											Показывать рекомендации
										</span>
									</label>

									<label className='flex items-center space-x-2'>
										<input
											type='checkbox'
											checked={settings.showProgress}
											onChange={(e) =>
												onSettingsChange({
													...settings,
													showProgress: e.target.checked,
												})
											}
											className='rounded border-gray-600 text-emerald-600 focus:ring-emerald-500 bg-gray-700'
										/>
										<span className='text-gray-300'>
											Показывать прогресс в процентах
										</span>
									</label>

									<label className='flex items-center space-x-2'>
										<input
											type='checkbox'
											checked={settings.autoExport}
											onChange={(e) =>
												onSettingsChange({
													...settings,
													autoExport: e.target.checked,
												})
											}
											className='rounded border-gray-600 text-emerald-600 focus:ring-emerald-500 bg-gray-700'
										/>
										<span className='text-gray-300'>
											Автоматически сохранять историю
										</span>
									</label>
								</div>
							</div>

							<div>
								<h3 className='text-gray-100 font-medium mb-4'>Режим сна</h3>
								<div className='grid grid-cols-2 gap-4'>
									<Input
										type='time'
										label='Время сна:'
										value={settings.sleepTime}
										onChange={(e) =>
											onSettingsChange({
												...settings,
												sleepTime: e.target.value,
											})
										}
									/>
									<Input
										type='time'
										label='Время пробуждения:'
										value={settings.wakeTime}
										onChange={(e) =>
											onSettingsChange({
												...settings,
												wakeTime: e.target.value,
											})
										}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-6 flex justify-between border-t border-gray-700 pt-4'>
						<Button variant='secondary' onClick={onReset}>
							Сбросить
						</Button>
						<Button onClick={onClose}>Закрыть</Button>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	)
}
