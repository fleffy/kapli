import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger'
	children: ReactNode
	className?: string
}

export function Button({
	variant = 'primary',
	children,
	className = '',
	...props
}: ButtonProps) {
	const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors'
	const variantStyles = {
		primary: 'bg-emerald-800 hover:bg-emerald-700 text-gray-100',
		secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
		danger: 'bg-red-800 hover:bg-red-700 text-gray-100',
	}

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}
