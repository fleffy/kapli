import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
	return (
		<div className='space-y-2'>
			{label && (
				<label className='block text-gray-300 text-sm font-medium'>
					{label}
				</label>
			)}
			<input
				className={`w-full bg-gray-700 text-gray-100 rounded px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${className}`}
				{...props}
			/>
			{error && <p className='text-red-500 text-sm'>{error}</p>}
		</div>
	)
}
