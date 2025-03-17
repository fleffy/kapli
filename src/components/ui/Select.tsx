import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string
	error?: string
	options: Array<{ value: string; label: string }>
}

export function Select({
	label,
	error,
	options,
	className = '',
	...props
}: SelectProps) {
	return (
		<div className='space-y-2'>
			{label && (
				<label className='block text-gray-300 text-sm font-medium'>
					{label}
				</label>
			)}
			<select
				className={`w-full bg-gray-700 text-gray-100 rounded px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${className}`}
				{...props}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{error && <p className='text-red-500 text-sm'>{error}</p>}
		</div>
	)
}
